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
class MyUploadAdapter { /* ... */ }
function CustomUploadAdapterPlugin(editor) { /* ... */ }

// PostEditor: 새 게시글을 작성하거나 기존 게시글을 수정하는 페이지 컴포넌트입니다.
const PostEditor = () => {
  // --- HOOKS & CONTEXT ---
  const { boardKey, postId } = useParams(); // URL에서 게시판 키와 게시글 ID를 가져옵니다.
  const navigate = useNavigate();
  const { boardData, actions } = useCommunity();
  const { userProfile } = useProfile(); // 현재 로그인된 사용자 정보

  // --- STATE MANAGEMENT ---
  const isEditing = !!postId; // postId가 있으면 수정 모드, 없으면 생성 모드입니다.
  const [selectedBoardKey, setSelectedBoardKey] = useState(boardKey || 'free-talk');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // CKEditor의 내용은 HTML 문자열로 관리됩니다.
  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 제출 방지를 위한 상태

  const categories = Object.keys(boardData).map(key => ({ boardKey: key, category_name: boardData[key].name }));

  // --- EFFECTS ---
  // 수정 모드일 경우, 기존 게시글 데이터를 불러와 폼을 채웁니다.
  useEffect(() => {
    if (isEditing) {
      let foundPost = null;
      // 모든 게시판에서 해당 postId를 가진 게시글을 찾습니다.
      for (const key in boardData) {
        const post = [...boardData[key].posts, ...boardData[key].notices].find(p => p.id.toString() === postId);
        if (post) {
          foundPost = post;
          break;
        }
      }

      if (foundPost) {
        setTitle(foundPost.title);
        setContent(foundPost.content);
        setSelectedBoardKey(foundPost.boardKey || boardKey);
      } else {
        alert('수정할 게시글을 찾을 수 없습니다.');
        navigate('/community');
      }
    }
  }, [isEditing, postId, boardData, navigate, boardKey]);

  // --- HANDLER FUNCTIONS ---
  const handleCancel = () => { /* ... 취소 처리 ... */ };

  const handleSubmit = async () => {
    if (!title.trim()) { /* ... 유효성 검사 ... */ }
    if (!content.trim()) { /* ... 유효성 검사 ... */ }

    setIsSubmitting(true);

    const postData = {
      title: title.trim(),
      content: content.trim(),
      author: userProfile?.name || '익명',
    };

    try {
      if (isEditing) {
        // 수정 모드이면 updatePost 액션을 호출합니다.
        actions.updatePost(selectedBoardKey, postId, postData);
        alert('게시글이 수정되었습니다.');
        navigate(`/community/posts/${postId}`);
      } else {
        // 생성 모드이면 createPost 액션을 호출합니다.
        actions.createPost(selectedBoardKey, postData);
        alert('게시글이 등록되었습니다.');
        navigate(`/community/${selectedBoardKey}`);
      }
    } catch (error) {
      // ... 에러 처리 ...
    } finally {
      setIsSubmitting(false);
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
        {/* ... */}

        {/* 제목 입력 필드 */}
        {/* ... */}

        {/* CKEditor 위지윅 에디터 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>내용</label>
          <div className={styles.editorWrapper}>
            <CKEditor
              editor={ClassicEditor}
              data={content}
              config={{
                extraPlugins: [CustomUploadAdapterPlugin],
                placeholder: "내용을 입력하세요...",
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
            />
          </div>
        </div>

        <footer className={styles.editorFooter}>
          {/* ... 취소, 등록/수정 버튼 ... */}
        </footer>
      </div>
    </div>
  );
};

export default PostEditor;