// src/components/admin/CommunityCommentManagement.jsx
import React, { useState, useEffect } from 'react'; // React와 상태 관리를 위한 훅들을 가져옵니다.
import { useAdminAuth } from '../../context/AdminAuthContext'; // 관리자 인증 컨텍스트를 사용하기 위한 훅을 가져옵니다.
import adminStyles from './Admin.module.css'; // 관리자 페이지 전용 CSS 모듈을 가져옵니다.
import { mockDataService } from '../../utils/mockDataService';

const initialCommentData = [
  {
    id: 1,
    postId: 101,
    content: '첫 번째 게시글에 대한 멋진 댓글입니다!',
    authorId: 1,
    author_name: '사용자1',
    createdAt: '2023-01-15T10:00:00Z',
    parentCommentId: null,
  },
  {
    id: 2,
    postId: 101,
    content: '정말 공감합니다. 좋은 정보 감사합니다.',
    authorId: 2,
    author_name: '사용자2',
    createdAt: '2023-01-15T10:30:00Z',
    parentCommentId: null,
  },
  {
    id: 3,
    postId: 102,
    content: '이 게시글도 유익하네요.',
    authorId: 1,
    author_name: '사용자1',
    createdAt: '2023-01-16T11:00:00Z',
    parentCommentId: null,
  },
  {
    id: 4,
    postId: 101,
    content: '저도 그렇게 생각해요!',
    authorId: 3,
    author_name: '사용자3',
    createdAt: '2023-01-16T11:15:00Z',
    parentCommentId: 2,
  },
  {
    id: 5,
    postId: 103,
    content: '새로운 소식 잘 봤습니다.',
    authorId: 2,
    author_name: '사용자2',
    createdAt: '2023-01-17T12:00:00Z',
    parentCommentId: null,
  },
];

const CommunityCommentManagement = () => { // 커뮤니티 댓글 관리 컴포넌트입니다.
  const { isAdminAuthenticated } = useAdminAuth(); // 관리자 인증 상태를 가져옵니다.
  const [comments, setComments] = useState([]); // 댓글 목록을 저장할 상태입니다.
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태를 관리합니다.
  const [error, setError] = useState(null); // 오류 메시지를 저장할 상태입니다.
  const [editingComment, setEditingComment] = useState(null); // 수정 중인 댓글 정보를 저장할 상태입니다.
  const [newComment, setNewComment] = useState({ // 새로 추가할 댓글 정보를 저장할 상태입니다.
    postId: '',
    content: '',
    authorId: '',
    parentCommentId: '',
  });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 }); // 페이지네이션 정보를 저장할 상태입니다.
  const COMMENTS_PER_PAGE = 10; // 페이지당 댓글 수

  useEffect(() => { // 컴포넌트가 마운트되거나 관리자 인증 상태가 변경될 때 실행됩니다.
    mockDataService.initialize('comments', initialCommentData);
    if (isAdminAuthenticated) { // 관리자가 인증된 경우에만
      fetchComments(); // 댓글 목록을 불러옵니다.
    }
  }, [isAdminAuthenticated]); // isAdminAuthenticated 값이 변경될 때마다 이 효과를 다시 실행합니다.

  const fetchComments = async (page = 1) => { // 댓글 목록을 서버에서 가져오는 비동기 함수입니다.
    setLoading(true); // 로딩 상태를 true로 설정합니다.
    setError(null); // 이전 오류 메시지를 초기화합니다.
    try {
      const response = await mockDataService.getAll('comments');
      if (response.success) { // 응답이 성공적이면
        const allComments = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 최신순 정렬
        const totalPages = Math.ceil(allComments.length / COMMENTS_PER_PAGE);
        const startIndex = (page - 1) * COMMENTS_PER_PAGE;
        const endIndex = startIndex + COMMENTS_PER_PAGE;
        const paginatedComments = allComments.slice(startIndex, endIndex);

        setComments(paginatedComments); // 댓글 목록 상태를 업데이트합니다.
        setPagination({ currentPage: page, totalPages: totalPages }); // 페이지네이션 상태를 업데이트합니다.
      } else { // 응답이 실패하면
        setError('댓글 정보를 불러오는데 실패했습니다.'); // 오류 메시지를 설정합니다.
      }
    } catch (err) { // 요청 중 오류가 발생하면
      console.error('Failed to fetch comments:', err); // 콘솔에 오류를 기록합니다.
      setError('댓글 정보를 불러오는데 실패했습니다.'); // 일반 오류 메시지를 설정합니다.
    } finally { // 성공 여부와 관계없이 항상 실행됩니다。
      setLoading(false); // 로딩 상태를 false로 설정합니다.
    }
  };

  const handleInputChange = (e) => { // 입력 필드 값이 변경될 때 호출되는 함수입니다.
    const { name, value } = e.target; // 이벤트 타겟에서 name과 value를 추출합니다.
    if (editingComment) { // 수정 중인 댓글이 있으면
      setEditingComment({ ...editingComment, [name]: value }); // 수정 중인 댓글 상태를 업데이트합니다.
    } else { // 새 댓글을 작성 중이면
      setNewComment({ ...newComment, [name]: value }); // 새 댓글 상태를 업데이트합니다.
    }
  };

  const handleAddComment = async (e) => { // 새 댓글 추가 폼을 제출할 때 호출되는 함수입니다.
    e.preventDefault(); // 폼의 기본 제출 동작(페이지 새로고침)을 막습니다.
    setError(null); // 이전 오류 메시지를 초기화합니다.
    try {
      const { postId, content, authorId, parentCommentId } = newComment; // 새 댓글 상태에서 값을 추출합니다.
      if (!postId || !content || !authorId) { // 필수 필드가 비어있는지 확인합니다.
        setError('게시글 ID, 내용, 작성자 ID는 모두 필수입니다.'); // 오류 메시지를 설정합니다.
        return; // 함수 실행을 중단합니다.
      }

      const payload = { // 서버로 보낼 데이터(payload)를 구성합니다.
        postId: parseInt(postId, 10),
        content,
        authorId: parseInt(authorId, 10),
        author_name: `사용자${authorId}`, // Mock author name
        createdAt: new Date().toISOString(),
        parentCommentId: parentCommentId ? parseInt(parentCommentId, 10) : null,
      };

      const response = await mockDataService.create('comments', payload); // mockDataService를 통해 댓글을 추가합니다.
      if (response.success) {
        setNewComment({ postId: '', content: '', authorId: '', parentCommentId: '' }); // 새 댓글 폼을 초기화합니다.
        fetchComments(); // 댓글 목록을 다시 불러와 화면을 갱신합니다.
      } else {
        setError(response.message || '댓글 추가에 실패했습니다.');
      }
    } catch (err) { // 요청 중 오류가 발생하면
      console.error('Failed to add comment:', err); // 콘솔에 오류를 기록합니다.
      setError('댓글 추가에 실패했습니다.'); // 오류 메시지를 설정합니다.
    }
  };

  const handleEditComment = async (e) => { // 댓글 수정 폼을 제출할 때 호출되는 함수입니다.
    e.preventDefault(); // 폼의 기본 제출 동작을 막습니다.
    setError(null); // 이전 오류 메시지를 초기화합니다.
    if (!editingComment) return; // 수정 중인 댓글이 없으면 함수를 종료합니다.
    try {
      const { id, content } = editingComment; // 수정 중인 댓글 상태에서 값을 추출합니다.
      const response = await mockDataService.update('comments', id, { content }); // mockDataService를 통해 댓글을 업데이트합니다.
      if (response.success) {
        setEditingComment(null); // 수정 상태를 종료합니다.
        fetchComments(); // 댓글 목록을 다시 불러와 화면을 갱신합니다.
      } else {
        setError(response.message || '댓글 수정에 실패했습니다.');
      }
    } catch (err) { // 요청 중 오류가 발생하면
      console.error('Failed to edit comment:', err); // 콘솔에 오류를 기록합니다.
      setError('댓글 수정에 실패했습니다.'); // 오류 메시지를 설정합니다.
    }
  };

  const handleDeleteComment = async (commentId) => { // 댓글 삭제 버튼을 클릭할 때 호출되는 함수입니다.
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return; // 사용자에게 삭제 여부를 확인합니다.
    setError(null); // 이전 오류 메시지를 초기화합니다.
    try {
      const response = await mockDataService.remove('comments', commentId); // mockDataService를 통해 댓글을 삭제합니다.
      if (response.success) {
        fetchComments(); // 댓글 목록을 다시 불러와 화면을 갱신합니다.
      } else {
        setError(response.message || '댓글 삭제에 실패했습니다.');
      }
    } catch (err) { // 요청 중 오류가 발생하면
      console.error('Failed to delete comment:', err); // 콘솔에 오류를 기록합니다。
      setError('댓글 삭제에 실패했습니다.'); // 오류 메시지를 설정합니다.
    }
  };

  if (loading) { // 로딩 중일 때 표시할 UI입니다.
    return <div className={adminStyles.userManagementContainer}>댓글 정보를 불러오는 중...</div>;
  }

  if (error) { // 오류가 발생했을 때 표시할 UI입니다.
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return ( // 컴포넌트의 최종 렌더링 결과입니다.
    <div className={adminStyles.userManagementContainer}>
      <h3>커뮤니티 댓글 관리</h3>

      {/* 새 댓글 추가 폼 */}
      <h4>새 댓글 추가</h4>
      <form onSubmit={handleAddComment} className={adminStyles.userForm}>
        <input type="number" name="postId" placeholder="게시글 ID" value={newComment.postId} onChange={handleInputChange} required />
        <textarea name="content" placeholder="내용" value={newComment.content} onChange={handleInputChange} rows="3" required></textarea>
        <input type="number" name="authorId" placeholder="작성자 ID" value={newComment.authorId} onChange={handleInputChange} required />
        <input type="number" name="parentCommentId" placeholder="부모 댓글 ID (선택 사항)" value={newComment.parentCommentId} onChange={handleInputChange} />
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      {/* 댓글 목록 */}
      <h4>기존 댓글</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>게시글 ID</th>
            <th>내용</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>옵션</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => ( // 댓글 목록을 순회하며 테이블 행을 생성합니다.
            <tr key={comment.id}>
              <td>{comment.id}</td>
              <td>{comment.postId}</td>
              <td>
                {editingComment?.id === comment.id ? ( // 현재 행이 수정 중인 댓글인지 확인합니다.
                  <textarea name="content" value={editingComment.content} onChange={handleInputChange} className={adminStyles.userEditInput} rows="2"></textarea> // 수정 모드일 때 텍스트 영역을 보여줍니다.
                ) : (
                  comment.content // 일반 모드일 때 내용을 텍스트로 보여줍니다.
                )}
              </td>
              <td>{comment.author_name || 'N/A'}</td> {/* 작성자 이름을 표시합니다. */}
              <td>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'N/A'}</td> {/* 생성일을 표시합니다. */}
              <td>
                {editingComment?.id === comment.id ? ( // 수정 모드일 때의 버튼들입니다.
                  <>
                    <button onClick={handleEditComment} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingComment(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : ( // 일반 모드일 때의 버튼들입니다.
                  <>
                    <button onClick={() => setEditingComment({ ...comment })}>수정</button>
                    <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
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
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => ( // 페이지 수만큼 버튼을 생성합니다.
            <button
              key={page} // 각 버튼의 고유 키
              onClick={() => fetchComments(page)} // 버튼 클릭 시 해당 페이지의 댓글 목록을 불러옵니다.
              className={pagination.currentPage === page ? adminStyles.activePage : ''} // 현재 페이지에 활성 스타일을 적용합니다.
            >
              {page}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default CommunityCommentManagement; // 컴포넌트를 내보냅니다.
