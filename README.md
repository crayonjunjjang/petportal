# PetPortal - 반려동물 종합 케어 플랫폼

반려동물을 위한 종합 케어 서비스 플랫폼입니다. 미용, 병원, 호텔, 카페 등 다양한 서비스를 제공하며, 커뮤니티 기능을 포함합니다.

## 주요 기능

- 🏥 **병원 찾기**: 반려동물 병원 검색 및 예약
- ✂️ **미용 서비스**: 펫 미용샵 예약 및 관리
- 🏨 **숙박 서비스**: 반려동물 동반 숙소 예약
- ☕ **카페 정보**: 펫 프렌들리 카페 찾기
- 🛒 **쇼핑몰**: 반려동물 용품 구매
- 💬 **커뮤니티**: 반려동물 관련 정보 공유

## 기술 스택

### Frontend
- React 18 + Vite
- React Router
- Axios
- CSS Modules

### 지도 서비스
- 카카오맵 API

## 프로젝트 구조

```
C:\Users\1\Desktop\my-app\
├───.gitignore
├───eslint.config.js
├───index.html
├───package-lock.json
├───package.json
├───README.md
├───vite.config.js
├───.git\...
├───node_modules\...
├───public\
│   ├───vite.svg
│   └───grooming_images\
│       ├───grooming1.jpg
│       ├───grooming2.jpg
│       ├───grooming3.jpg
│       └───grooming4.png
└───src\
    ├───App.css
    ├───App.jsx
    ├───index.css
    ├───main.jsx
    ├───assets\
    │   ├───date.png
    │   ├───react.svg
    │   ├───search.png
    │   ├───time.png
    │   ├───image\
    │   │   ├───1.jpg
    │   │   ├───2.jpg
    │   │   ├───3.jpg
    │   │   ├───4.png
    │   │   ├───google.png
    │   │   ├───hero-bg.jpg
    │   │   ├───logo.png
    │   │   ├───logo2.png
    │   │   ├───logo3.png
    │   │   ├───naver.png
    │   │   └───petitem.png
    │   └───images\
    │       └───profiles\
    ├───components\
    │   ├───Button.jsx
    │   ├───Button.module.css
    │   ├───admin\
    │   │   ├───AccommodationManagement.jsx
    │   │   ├───Admin.module.css
    │   │   ├───AdminNotifications.jsx
    │   │   ├───CafeManagement.jsx
    │   │   ├───CommunityCommentManagement.jsx
    │   │   ├───CommunityPostManagement.jsx
    │   │   ├───GroomingManagement.jsx
    │   │   ├───HospitalManagement.jsx
    │   │   ├───HotelManagement.jsx
    │   │   ├───MaintenanceManagement.jsx
    │   │   ├───ProductManagement.jsx
    │   │   ├───ProductManagement.module.css
    │   │   ├───SupportManagement.jsx
    │   │   └───UserManagement.jsx
    │   ├───common\
    │   │   ├───AuthButtons.jsx
    │   │   ├───AuthButtons.module.css
    │   │   ├───BackgroundSlider.jsx
    │   │   ├───BackgroundSlider.module.css
    │   │   ├───BaseServiceMapView.jsx
    │   │   ├───BusinessCard.jsx
    │   │   ├───BusinessCard.module.css
    │   │   ├───BusinessCardGrid.jsx
    │   │   ├───BusinessList.jsx
    │   │   ├───BusinessList.module.css
    │   │   ├───BusinessListItem.jsx
    │   │   ├───CartIcon.jsx
    │   │   ├───CartIcon.module.css
    │   │   ├───CategoryNav.jsx
    │   │   ├───CategoryNav.module.css
    │   │   ├───FilterSection.jsx
    │   │   ├───FilterSection.module.css
    │   │   ├───HamburgerButton.jsx
    │   │   ├───HamburgerButton.module.css
    │   │   ├───HeroSection.jsx
    │   │   ├───HeroSection.module.css
    │   │   ├───LoadingOverlay.jsx
    │   │   ├───LoadingOverlay.module.css
    │   │   ├───Logo.jsx
    │   │   ├───Logo.module.css
    │   │   └───MapView.jsx
    │   │   └───...
    │   ├───community\
    │   ├───grooming\
    │   ├───layout\
    │   ├───modal\
    │   ├───pension\
    │   ├───products\
    │   ├───profile\
    │   ├───sections\
    │   ├───service\
    │   ├───support\
    │   └───ui\
    ├───config\
    │   └───serviceMapConfig.js
    ├───context\
    │   ├───AdminAuthContext.jsx
    │   ├───AuthContext.jsx
    │   ├───MaintenanceContext.jsx
    │   └───ProfileContext.jsx
    ├───contexts\
    │   ├───AdminAuthContext.jsx
    │   ├───CartContext.jsx
    │   ├───CommunityContext.jsx
    │   ├───SearchContext.jsx
    │   └───UIContext.jsx
    ├───data\
    │   ├───admin_users.json
    │   ├───cafe.json
    │   ├───grooming.json
    │   ├───hospital.json
    │   ├───hotel.json
    │   ├───mockCommunityData.js
    │   ├───mockPensionData.js
    │   ├───products.json
    │   └───users.json
    ├───fonts\
    │   ├───Jalnan2.otf
    │   └───Jalnan2TTF.ttf
    ├───hooks\
    │   └───useFetchAndFilterData.js
    ├───pages\
    │   ├───AdminDashboardPage.jsx
    │   ├───AdminDashboardPage.module.css
    │   ├───AdminLogin.module.css
    │   ├───AdminLoginPage.jsx
    │   ├───CafeDetailPage.jsx
    │   ├───CafeDetailPage.module.css
    │   ├───CafePage.jsx
    │   ├───CafePage.module.css
    │   ├───CartPage.jsx
    │   ├───CartPage.module.css
    │   ├───commonLayout.module.css
    │   ├───CommunityPage.jsx
    │   ├───CommunityPage.module.css
    │   ├───CustomerServicePage.jsx
    │   ├───CustomerServicePage.module.css
    │   ├───DetailPage.module.css
    │   ├───GroomingDetailPage.jsx
    │   ├───GroomingDetailPage.module.css
    │   ├───GroomingPage.jsx
    │   ├───GroomingPage.module.css
    │   ├───HomePage.jsx
    │   ├───HomePage.module.css
    │   ├───HospitalDetailPage.jsx
    │   ├───HospitalDetailPage.module.css
    │   ├───HospitalPage.jsx
    │   ├───HospitalPage.module.css
    │   ├───HotelDetailPage.jsx
    │   ├───HotelDetailPage.module.css
    │   ├───HotelPage.jsx
    │   ├───HotelPage.module.css
    │   ├───index.js
    │   ├───LoginPage.jsx
    │   ├───LoginPage.module.css
    │   ├───MaintenancePage.jsx
    │   ├───MaintenancePage.module.css
    │   ├───MapPage.module.css
    │   ├───MapTestPage.jsx
    │   ├───Page.module.css
    │   ├───PensionDetailPage.jsx
    │   ├───PensionDetailPage.module.css
    │   ├───PensionPage.jsx
    │   ├───PensionPage.module.css
    │   ├───PostDetail.jsx
    │   ├───PostDetail.module.css
    │   ├───PostEditor.jsx
    │   ├───PostEditor.module.css
    │   ├───PostsPage.jsx
    │   ├───PostView.jsx
    │   ├───PostView.module.css
    │   ├───ProductDetailPage.jsx
    │   ├───ProductDetailPage.module.css
    │   ├───ProductPage.jsx
    │   ├───ProductPage.module.css
    │   ├───SignupPage.jsx
    │   ├───SignupPage.module.css
    │   ├───SupportPage.jsx
    │   └───useBusinessSearch.js
    ├───providers\
    │   ├───AdminProtectedRoute.jsx
    │   └───ProtectedRoute.jsx
    ├───services\
    │   ├───adminAuthAPI.js
    │   └───authAPI.js
    ├───types\
    │   └───serviceMapTypes.js
    └───utils\
        ├───axiosConfig.js
        ├───constants.js
        ├───loadKakaoMap.js
        ├───locationUtils.js
        ├───mockDataService.js
        ├───petData.js
        ├───serviceMapErrorHandler.js
        ├───serviceMapUtils.js
        └───__tests__\
```

## 설치 및 실행

### 1. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 카카오맵 API 키 (필수)
VITE_KAKAO_JS_KEY=your_kakao_api_key_here
```

### 2. 카카오맵 API 키 발급 방법

1. [카카오 개발자 콘솔](https://developers.kakao.com/)에 접속
2. 애플리케이션 생성 또는 기존 앱 선택
3. **플랫폼 설정** → **Web 플랫폼 등록**
4. 사이트 도메인 추가:
   - 개발: `http://localhost:5173`
   - 배포: 실제 도메인 주소
5. **JavaScript 키**를 복사하여 `.env` 파일에 설정

### 3. 설치 및 실행

```bash
npm install         # 의존성 설치 (처음 실행 시)
npm run dev        # 개발 서버 시작 (http://localhost:5173)
```

## 관리자 기능

관리자 페이지([/admin/login](http://localhost:5173/admin/login))를 통해 다음 기능들을 구현할 예정입니다. 현재는 UI 중심으로 개발되어 있습니다.

- 사용자 관리
- 상품 관리
- 숙소 관리 (가격, 위치 정보 포함)
- 커뮤니티 게시글/댓글 관리
- 각종 서비스 업체 정보 관리

## 문제 해결

### 카카오맵이 로드되지 않는 경우

1. `.env` 파일의 API 키 확인
2. 카카오 개발자 콘솔에서 도메인 설정 확인
3. API 키가 없어도 대체 지도 뷰가 표시됩니다

```