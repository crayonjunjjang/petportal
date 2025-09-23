// C:\Users\1\Desktop\my-app\src\main.jsx

// --- 프로젝트 개요 및 실행 흐름 ---
// 이 프로젝트는 React 기반의 웹 애플리케이션으로, 반려동물 관련 다양한 서비스를 제공합니다.
// 프로그램의 시작점은 이 `main.jsx` 파일이며, 여기서 React 애플리케이션이 초기화되고 DOM에 렌더링됩니다.
// 실행 흐름은 다음과 같습니다:
// 1. `main.jsx`: React 애플리케이션의 진입점으로, `index.css`를 로드하고, `BrowserRouter`를 통해 클라이언트 측 라우팅을 설정합니다.
//    `AuthProvider`를 사용하여 전역 인증 상태를 제공하고, 그 안에 `App` 컴포넌트를 렌더링합니다.
// 2. `App.jsx`: 애플리케이션의 메인 컴포넌트로, 다양한 Context Provider(예: UIContext, CommunityContext 등)를 설정하고,
//    `react-router-dom`의 `Routes`를 사용하여 URL 경로에 따라 적절한 페이지 컴포넌트를 렌더링합니다.
// 3. 페이지 컴포넌트 (예: `HomePage.jsx`, `LoginPage.jsx`, `PensionPage.jsx`): 특정 경로에 매핑되어 UI를 구성합니다.
//    이 페이지들은 다시 여러 하위 컴포넌트(예: `AuthButtons.jsx`, `PensionCard.jsx`, `FilterSection.jsx`)를 조합하여 사용합니다.
// 4. Context Provider (예: `AuthContext.jsx`, `UIContext.jsx`): 애플리케이션 전반에 걸쳐 공유되는 상태(인증 정보, UI 로딩 상태 등)를 관리하고 제공합니다.
// 5. 서비스 파일 (예: `authAPI.js`, `adminAuthAPI.js`): 백엔드 API와의 통신(현재는 대부분 목업)을 담당하며, 비즈니스 로직의 일부를 처리합니다.
// 6. 컴포넌트 (예: `Button.jsx`, `Pagination.jsx`): 재사용 가능한 UI 요소들을 정의합니다.
// 7. 유틸리티 (예: `locationUtils.js`): 공통적으로 사용되는 헬퍼 함수들을 모아놓습니다.
// 8. 스타일 파일 (`.module.css`, `global.css`): 애플리케이션의 시각적 디자인을 정의합니다.
// 9. 데이터 파일 (`.json`, `.js`): 개발 환경에서 사용되는 목업 데이터를 제공합니다.

// --- 파일 역할: React 애플리케이션의 진입점 (Entry Point) ---
// 이 파일은 React 애플리케이션을 DOM에 마운트하고, 전역적인 설정(라우팅, 인증 컨텍스트)을 담당합니다.

// --- IMPORT ---
import { StrictMode } from 'react' // React의 엄격 모드 (개발 시 잠재적 문제 감지용)
import { createRoot } from 'react-dom/client' // React 18의 새로운 클라이언트 렌더링 API
import { BrowserRouter } from 'react-router-dom'; // 클라이언트 측 라우팅을 위한 라우터 컴포넌트
import './index.css' // 전역 CSS 스타일 시트
import App from './App.jsx' // 애플리케이션의 최상위 컴포넌트
import { AuthProvider } from './context/AuthContext'; // 사용자 인증 상태를 제공하는 컨텍스트 프로바이더
import { UIProvider } from './contexts/UIContext'; // UI 관련 전역 상태(예: 로딩 스피너)를 제공하는 컨텍스트 프로바이더
import { CommunityProvider } from './contexts/CommunityContext'; // 커뮤니티 관련 전역 상태를 제공하는 컨텍스트 프로바이더
import { ProfileProvider } from './context/ProfileContext'; // 사용자 프로필 관련 전역 상태를 제공하는 컨텍스트 프로바이더
import { AdminAuthProvider } from './context/AdminAuthContext'; // 관리자 인증 상태를 제공하는 컨텍스트 프로바이더

// --- APPLICATION RENDERING ---
// `document.getElementById('root')`를 통해 HTML 문서의 'root' 엘리먼트를 가져와 React 애플리케이션을 렌더링합니다.
createRoot(document.getElementById('root')).render(
  // StrictMode는 개발 모드에서 잠재적인 문제를 식별하기 위한 도구입니다.
  // 현재는 주석 처리되어 있지만, 개발 시 활성화하여 경고를 확인할 수 있습니다.
  // <StrictMode>

  // BrowserRouter: 애플리케이션 전체에 걸쳐 클라이언트 측 라우팅을 활성화합니다.
  // URL 변경에 따라 컴포넌트를 조건부로 렌더링할 수 있게 합니다.
  <BrowserRouter>
    {/* AdminAuthProvider: 관리자 인증 관련 상태(로그인 여부, 관리자 정보 등)를 하위 컴포넌트에 제공합니다. */}
    <AdminAuthProvider>
      {/* AuthProvider: 일반 사용자 인증 관련 상태(로그인 여부, 사용자 정보 등)를 하위 컴포넌트에 제공합니다. */}
      <AuthProvider>
        {/* ProfileProvider: 사용자 프로필 관련 상태(예: 펫 정보)를 하위 컴포넌트에 제공합니다. */}
        <ProfileProvider>
          {/* UIProvider: 전역 UI 상태(예: 로딩 스피너 표시 여부)를 하위 컴포넌트에 제공합니다. */}
          <UIProvider>
            {/* CommunityProvider: 커뮤니티 게시판 관련 상태(게시글 목록, 댓글 등)를 하위 컴포넌트에 제공합니다. */}
            <CommunityProvider>
              {/* App 컴포넌트: 애플리케이션의 메인 라우팅 및 레이아웃을 담당합니다. */}
              <App />
            </CommunityProvider>
          </UIProvider>
        </ProfileProvider>
      </AuthProvider>
    </AdminAuthProvider>
  </BrowserRouter>
  // </StrictMode>
)