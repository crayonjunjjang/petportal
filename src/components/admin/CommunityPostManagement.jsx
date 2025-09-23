// src/components/admin/CommunityPostManagement.jsx
import React, { useState, useEffect } from 'react'; // React와 상태 관리를 위한 훅들을 가져옵니다.
import { useAdminAuth } from '../../context/AdminAuthContext'; // 관리자 인증 컨텍스트를 사용하기 위한 훅을 가져옵니다.
import adminStyles from './Admin.module.css'; // 관리자 페이지 전용 CSS 모듈을 가져옵니다.
import { mockDataService } from '../../utils/mockDataService';

const initialPostData = [
  {
    id: 101,
    title: '반려동물과 함께하는 행복한 산책로 추천',
    content: '서울 근교에 반려동물과 함께 걷기 좋은 산책로를 소개합니다. 공기도 맑고 경치도 좋아서 힐링하기 딱이에요!',
    authorId: 1,
    author_name: '펫사랑1',
    createdAt: '2023-01-10T09:00:00Z',
    views: 125,
    likes: 30,
  },
  {
    id: 102,
    title: '강아지 수제 간식 만들기 도전기',
    content: '우리 강아지를 위해 직접 수제 간식을 만들어봤어요. 생각보다 쉽고 강아지도 너무 좋아하네요! 레시피 공유합니다.',
    authorId: 2,
    author_name: '멍멍맘',
    createdAt: '2023-01-12T14:30:00Z',
    views: 230,
    likes: 55,
  },
  {
    id: 103,
    title: '고양이 행동 전문가에게 물어보세요!',
    content: '고양이의 이상 행동 때문에 고민이 많았는데, 전문가 상담 후 많은 것을 배웠어요. 궁금한 점 댓글로 남겨주세요.',
    authorId: 3,
    author_name: '냥집사',
    createdAt: '2023-01-15T11:00:00Z',
    views: 88,
    likes: 15,
  },
  {
    id: 104,
    title: '새로운 펫용품 리뷰: 자동 급식기',
    content: '최근 구매한 자동 급식기 사용 후기입니다. 장단점과 실제 사용 팁을 공유하니 구매 고려하시는 분들께 도움이 되길 바랍니다.',
    authorId: 1,
    author_name: '펫사랑1',
    createdAt: '2023-01-18T16:00:00Z',
    views: 180,
    likes: 40,
  },
];

const CommunityPostManagement = () => { // 커뮤니티 게시글 관리 컴포넌트입니다.
  const { isAdminAuthenticated } = useAdminAuth(); // 관리자 인증 상태를 가져옵니다.
  const [posts, setPosts] = useState([]); // 게시글 목록을 저장할 상태입니다.
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태를 관리합니다.
  const [error, setError] = useState(null); // 오류 메시지를 저장할 상태입니다.
  const [editingPost, setEditingPost] = useState(null); // 수정 중인 게시글 정보를 저장할 상태입니다.
  const [newPost, setNewPost] = useState({ // 새로 추가할 게시글 정보를 저장할 상태입니다.
    title: '',
    content: '',
    authorId: '',
  });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 }); // 페이지네이션 정보를 저장할 상태입니다.
  const POSTS_PER_PAGE = 10; // 페이지당 게시글 수

  useEffect(() => { // 컴포넌트가 마운트되거나 관리자 인증 상태가 변경될 때 실행됩니다.
    mockDataService.initialize('posts', initialPostData);
    if (isAdminAuthenticated) { // 관리자가 인증된 경우에만
      fetchPosts(); // 게시글 목록을 불러옵니다.
    }
  }, [isAdminAuthenticated]); // isAdminAuthenticated 값이 변경될 때마다 이 효과를 다시 실행합니다.

  const fetchPosts = async (page = 1) => { // 게시글 목록을 서버에서 가져오는 비동기 함수입니다.
    setLoading(true); // 로딩 상태를 true로 설정합니다.
    setError(null); // 이전 오류 메시지를 초기화합니다.
    try {
      const response = await mockDataService.getAll('posts');
      if (response.success) { // 응답이 성공적이면
        const allPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 최신순 정렬
        const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
        const startIndex = (page - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const paginatedPosts = allPosts.slice(startIndex, endIndex);

        setPosts(paginatedPosts); // 게시글 목록 상태를 업데이트합니다.
        setPagination({ currentPage: page, totalPages: totalPages }); // 페이지네이션 상태를 업데이트합니다.
      } else { // 응답이 실패하면
        setError('게시글 정보를 불러오는데 실패했습니다.'); // 오류 메시지를 설정합니다.
      }
    } catch (err) { // 요청 중 오류가 발생하면
      console.error('Failed to fetch posts:', err); // 콘솔에 오류를 기록합니다.
      setError('게시글 정보를 불러오는데 실패했습니다.'); // 일반 오류 메시지를 설정합니다.
    } finally { // 성공 여부와 관계없이 항상 실행됩니다.
      setLoading(false); // 로딩 상태를 false로 설정합니다.
    }
  };

  const handleInputChange = (e) => { // 입력 필드 값이 변경될 때 호출되는 함수입니다.
    const { name, value } = e.target; // 이벤트 타겟에서 name과 value를 추출합니다.
    if (editingPost) { // 수정 중인 게시글이 있으면
      setEditingPost({ ...editingPost, [name]: value }); // 수정 중인 게시글 상태를 업데이트합니다.
    } else { // 새 게시글을 작성 중이면
      setNewPost({ ...newPost, [name]: value }); // 새 게시글 상태를 업데이트합니다.
    }
  };

  const handleAddPost = async (e) => { // 새 게시글 추가 폼을 제출할 때 호출되는 함수입니다.
    e.preventDefault(); // 폼의 기본 제출 동작(페이지 새로고침)을 막습니다.
    setError(null); // 이전 오류 메시지를 초기화합니다.
    try {
      const { title, content, authorId } = newPost; // 새 게시글 상태에서 값을 추출합니다.
      if (!title || !content || !authorId) {
        setError('제목, 내용, 작성자 ID는 모두 필수입니다.');
        return;
      }
      const payload = {
        title,
        content,
        authorId: parseInt(authorId, 10),
        author_name: `사용자${authorId}`, // Mock author name
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
      };
      const response = await mockDataService.create('posts', payload); // mockDataService를 통해 게시글을 추가합니다.
      if (response.success) {
        setNewPost({ title: '', content: '', authorId: '' }); // 새 게시글 폼을 초기화합니다.
        fetchPosts(); // 게시글 목록을 다시 불러와 화면을 갱신합니다.
      } else {
        setError(response.message || '게시글 추가에 실패했습니다.');
      }
    } catch (err) { // 요청 중 오류가 발생하면
      console.error('Failed to add post:', err); // 콘솔에 오류를 기록합니다.
      setError('게시글 추가에 실패했습니다.'); // 오류 메시지를 설정합니다.
    }
  };

  const handleEditPost = async (e) => { // 게시글 수정 폼을 제출할 때 호출되는 함수입니다.
    e.preventDefault(); // 폼의 기본 제출 동작을 막습니다.
    setError(null); // 이전 오류 메시지를 초기화합니다.
    if (!editingPost) return; // 수정 중인 게시글이 없으면 함수를 종료합니다.
    try {
      const { id, title, content } = editingPost; // 수정 중인 게시글 상태에서 값을 추출합니다.
      const response = await mockDataService.update('posts', id, { title, content }); // mockDataService를 통해 게시글을 업데이트합니다.
      if (response.success) {
        setEditingPost(null); // 수정 상태를 종료합니다。
        fetchPosts(); // 게시글 목록을 다시 불러와 화면을 갱신합니다.
      } else {
        setError(response.message || '게시글 수정에 실패했습니다.');
      }
    } catch (err) { // 요청 중 오류가 발생하면
      console.error('Failed to edit post:', err); // 콘솔에 오류를 기록합니다.
      setError('게시글 수정에 실패했습니다.'); // 오류 메시지를 설정합니다.
    }
  };

  const handleDeletePost = async (postId) => { // 게시글 삭제 버튼을 클릭할 때 호출되는 함수입니다.
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return; // 사용자에게 삭제 여부를 확인합니다.
    setError(null); // 이전 오류 메시지를 초기화합니다.
    try {
      const response = await mockDataService.remove('posts', postId); // mockDataService를 통해 게시글을 삭제합니다.
      if (response.success) {
        fetchPosts(); // 게시글 목록을 다시 불러와 화면을 갱신합니다.
      } else {
        setError(response.message || '게시글 삭제에 실패했습니다.');
      }
    } catch (err) { // 요청 중 오류가 발생하면
      console.error('Failed to delete post:', err); // 콘솔에 오류를 기록합니다.
      setError('게시글 삭제에 실패했습니다.'); // 오류 메시지를 설정합니다.
    }
  };

  if (loading) { // 로딩 중일 때 표시할 UI입니다.
    return <div className={adminStyles.userManagementContainer}>게시글 정보를 불러오는 중...</div>;
  }

  if (error) { // 오류가 발생했을 때 표시할 UI입니다.
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return ( // 컴포넌트의 최종 렌더링 결과입니다.
    <div className={adminStyles.userManagementContainer}>
      <h3>커뮤니티 게시글 관리</h3>

      {/* 새 게시글 추가 폼 */}
      <h4>새 게시글 추가</h4>
      <form onSubmit={handleAddPost} className={adminStyles.userForm}>
        <input type="text" name="title" placeholder="제목" value={newPost.title} onChange={handleInputChange} required />
        <textarea name="content" placeholder="내용" value={newPost.content} onChange={handleInputChange} rows="5" required></textarea>
        <input type="number" name="authorId" placeholder="작성자 ID" value={newPost.authorId} onChange={handleInputChange} required />
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      {/* 게시글 목록 */}
      <h4>기존 게시글</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
            <th>좋아요</th>
            <th>옵션</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => ( // 게시글 목록을 순회하며 테이블 행을 생성합니다.
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>
                {editingPost?.id === post.id ? ( // 현재 행이 수정 중인 게시글인지 확인합니다.
                  <input type="text" name="title" value={editingPost.title} onChange={handleInputChange} className={adminStyles.userEditInput} /> // 수정 모드일 때 입력 필드를 보여줍니다.
                ) : (
                  post.title // 일반 모드일 때 제목을 텍스트로 보여줍니다.
                )}
              </td>
              <td>
                {post.author_name || 'N/A'} {/* 작성자 이름을 표시합니다. */}
              </td>
              <td>{post.createdAt ? new Date(post.createdAt).toLocaleString() : 'N/A'}</td> {/* 생성일을 표시합니다. */}
              <td>{post.views}</td> {/* 조회수를 표시합니다. */}
              <td>{post.likes}</td> {/* 좋아요 수를 표시합니다. */}
              <td>
                {editingPost?.id === post.id ? ( // 수정 모드일 때의 버튼들입니다.
                  <>
                    <button onClick={handleEditPost} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingPost(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : ( // 일반 모드일 때의 버튼들입니다.
                  <>
                    <button onClick={() => setEditingPost({ ...post })}>수정</button>
                    <button onClick={() => handleDeletePost(post.id)}>삭제</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 UI */}
      {pagination.totalPages > 1 && ( // 전체 페이지가 1보다 클 때만 페이지네이션을 표시합니다.
        <div className={adminStyles.pagination}>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => fetchPosts(page)}
              className={pagination.currentPage === page ? adminStyles.activePage : ''}
            >
              {page}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default CommunityPostManagement; // 컴포넌트를 내보냅니다.
