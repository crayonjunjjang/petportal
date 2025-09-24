// src/pages/PostEditor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommunity } from '../contexts/CommunityContext';
import { useProfile } from '../context/ProfileContext';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styles from './PostEditor.module.css';
import Button from '../components/ui/Button';

// CKEditor5의 이미지 업로드를 처리하기 위한 커스텀 어댑터입니다.
// 여기서는 이미지를 Base64 인코딩된 문자열로 변환하여 에디터에 직접 삽입합니다.
// 실제 프로덕션 환경에서는 서버에 이미지를 업로드하고 URL을 반환하는 로직이 필요합니다.
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener('load', () => {
          resolve({ default: reader.result });
        });

        reader.addEventListener('error', reject);
        reader.addEventListener('abort', reject);

        reader.readAsDataURL(file);
      }));
  }

  abort() {
    // TODO: Abort upload
  }
}

function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

// PostEditor: 새 게시글을 작성하거나 기존 게시글을 수정하는 페이지 컴포넌트입니다.
const PostEditor = () => {
  // --- HOOKS & CONTEXT ---
  // URL 파라미터에서 게시판 키(boardKey)와 게시글 ID(postId)를 추출합니다.
  // postId가 존재하면 수정 모드, 없으면 새 글 작성 모드입니다.
  const { boardKey, postId } = useParams(); 
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  // CommunityContext에서 게시판 데이터(boardData)와 게시글 관련 액션(actions)을 가져옵니다.
  const { boardData, actions } = useCommunity();
  // ProfileContext에서 현재 로그인된 사용자 정보(userProfile)와 인증 상태(isAuthenticated)를 가져옵니다.
  const { userProfile, isAuthenticated } = useProfile();

  useEffect(() => {
    // 사용자가 로그인하지 않은 경우, 글쓰기/수정 페이지에 접근할 수 없도록 처리합니다.
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login'); // 로그인 페이지로 리디렉션
    }
  }, [isAuthenticated, navigate]);

  // --- STATE MANAGEMENT ---
  // postId의 존재 여부로 수정 모드인지 새 글 작성 모드인지 판단합니다.
  const isEditing = !!postId; 
  // 선택된 게시판 키를 관리하는 상태입니다. URL의 boardKey를 기본값으로 사용하거나 'free-talk'을 기본값으로 합니다.
  const [selectedBoardKey, setSelectedBoardKey] = useState(boardKey || 'free-talk');
  const [title, setTitle] = useState(''); // 게시글 제목 상태
  const [content, setContent] = useState(''); // CKEditor의 내용을 HTML 문자열로 관리하는 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 제출 방지를 위한 상태

  // boardData 객체를 배열로 변환하여 게시판 선택 드롭다운에 사용할 카테고리 목록을 생성합니다.
  const categories = Object.keys(boardData).map(key => ({ boardKey: key, category_name: boardData[key].name }));

  // --- EFFECTS ---
  // 컴포넌트 마운트 시 또는 isEditing, postId, boardData, navigate, boardKey 중 하나라도 변경될 때 실행됩니다.
  // 수정 모드일 경우, 기존 게시글 데이터를 불러와 폼 필드를 채웁니다.
  useEffect(() => {
    if (isEditing) {
      let foundPost = null;
      // 모든 게시판의 게시글과 공지사항에서 해당 postId를 가진 게시글을 찾습니다.
      for (const key in boardData) {
        const post = [...boardData[key].posts, ...boardData[key].notices].find(p => p.id.toString() === postId);
        if (post) {
          foundPost = post;
          break;
        }
      }

      if (foundPost) {
        // 찾은 게시글 데이터로 제목, 내용, 선택된 게시판 키 상태를 업데이트합니다.
        setTitle(foundPost.title);
        setContent(foundPost.content);
        setSelectedBoardKey(foundPost.boardKey || boardKey);
      } else {
        // 게시글을 찾지 못하면 사용자에게 알리고 커뮤니티 메인 페이지로 리다이렉트합니다.
        alert('수정할 게시글을 찾을 수 없습니다.');
        navigate('/community');
      }
    }
  }, [isEditing, postId, boardData, navigate, boardKey]);

  // --- HANDLER FUNCTIONS ---
  // 취소 버튼 클릭 시 호출되는 핸들러입니다.
  // 수정 모드일 경우 해당 게시글 상세 페이지로, 새 글 작성 모드일 경우 해당 게시판 목록으로 이동합니다.
  const handleCancel = () => {
    if (isEditing) {
      navigate(`/community/posts/${postId}`);
    } else {
      navigate(`/community/${selectedBoardKey}`);
    }
  };

  // 게시글 제출(등록/수정) 버튼 클릭 시 호출되는 핸들러입니다.
  const handleSubmit = async () => {
    // 제목 유효성 검사: 제목이 비어있으면 경고 메시지 표시
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    // 내용 유효성 검사: 내용이 비어있으면 경고 메시지 표시
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true); // 제출 중 상태로 설정하여 중복 제출 방지

    // 서버로 전송할 게시글 데이터를 구성합니다.
    const postData = {
      title: title.trim(),
      content: content.trim(),
      author: userProfile?.nickname || '비회원', // 로그인된 사용자 닉네임 또는 '익명' 사용
    };

    try {
      if (isEditing) {
        // 수정 모드이면 CommunityContext의 updatePost 액션을 호출합니다.
        actions.updatePost(selectedBoardKey, postId, postData);
        alert('게시글이 수정되었습니다.');
        // 수정 완료 후 해당 게시글 상세 페이지로 이동합니다.
        navigate(`/community/posts/${postId}`);
      } else {
        // 생성 모드이면 CommunityContext의 createPost 액션을 호출합니다.
        actions.createPost(selectedBoardKey, postData);
        alert('게시글이 등록되었습니다.');
        // 등록 완료 후 해당 게시판 목록 페이지로 이동합니다.
        navigate(`/community/${selectedBoardKey}`);
      }
    } catch (error) {
      console.error('게시글 처리 중 오류 발생:', error);
      alert('게시글 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false); // 제출 완료 후 상태 초기화
    }
  };

  // --- RENDER ---
  return (
    <div className="container">
      <div className={styles.editorLayout}>
        <header className={styles.editorHeader}>
          <h2>{isEditing ? '글 수정' : '글쓰기'}</h2>
        </header>

        {/* 게시판 선택 드롭다운 */}
        <div className={styles.formGroup}> {/* 폼 그룹 스타일 적용 */}
          <label htmlFor="boardSelect" className={styles.label}>게시판 선택</label> {/* 라벨 스타일 적용 */}
          <select
            id="boardSelect"
            className={styles.boardSelector} // PostEditor.module.css에 정의된 게시판 선택 스타일 적용
            value={selectedBoardKey}
            onChange={(e) => setSelectedBoardKey(e.target.value)}
            disabled={isEditing} // 수정 모드에서는 게시판 변경 불가
          >
            {categories.map((category) => (
              <option key={category.boardKey} value={category.boardKey}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* 제목 입력 필드 */}
        <div className={styles.formGroup}> {/* 폼 그룹 스타일 적용 */}
          <label htmlFor="postTitle" className={styles.label}>제목</label> {/* 라벨 스타일 적용 */}
          <input
            type="text"
            id="postTitle"
            className={styles.titleInput} // PostEditor.module.css에 정의된 제목 입력 스타일 적용
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요."
          />
        </div>

        {/* CKEditor 위지윅 에디터 */}
        <div className={styles.formGroup}> {/* 폼 그룹 스타일 적용 */}
          <label className={styles.label}>내용</label> {/* 라벨 스타일 적용 */}
          <div className={styles.editorWrapper}>
            <CKEditor
              editor={ClassicEditor}
              data={content}
              config={{
                extraPlugins: [CustomUploadAdapterPlugin],
                placeholder: "내용을 입력하세요.",
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
            />
          </div>
        </div>

        <footer className={styles.editorFooter}> {/* 푸터 스타일 적용 */}
          {/* 취소 버튼: 클릭 시 handleCancel 함수 호출 */}
          <Button variant="secondary" onClick={handleCancel}>취소</Button>
          {/* 등록/수정 버튼: 클릭 시 handleSubmit 함수 호출, 제출 중일 때는 비활성화 */}
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isEditing ? '수정' : '등록'} {/* 수정 모드일 때는 '수정', 아니면 '등록' 표시 */}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default PostEditor;
