// src/components/common/BusinessCardGrid.jsx

// --- 파일 역할: 다양한 업체(Business) 정보를 카드 그리드 형태로 표시하는 공통 컴포넌트 ---
// 이 컴포넌트는 `items` 배열을 props로 받아, 각 아이템을 클릭 가능한 `Card` 컴포넌트로 렌더링합니다.
// 각 카드는 해당 업체의 상세 페이지로 연결되는 링크를 가집니다.
// `items` 배열이 비어있을 경우 사용자에게 메시지를 표시합니다.

import React from 'react'; // React 라이브러리 임포트
import { Link } from 'react-router-dom'; // React Router를 사용하여 내부 페이지 이동을 위한 Link 컴포넌트 임포트
import Card from '../ui/Card'; // 개별 업체 정보를 표시하는 범용 카드 UI 컴포넌트 임포트

// --- BusinessCardGrid Component ---
// props:
//   - items: 카드 그리드로 표시할 업체 데이터 객체들의 배열. 각 객체는 id, type 등의 속성을 포함해야 합니다.
const BusinessCardGrid = ({ items }) => {
  // 표시할 아이템이 없거나 배열이 비어있을 경우, 사용자에게 안내 메시지를 표시합니다.
  // 이는 UI/UX 측면에서 빈 화면을 방지하고 사용자에게 정보를 제공합니다.
  if (!items || items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 20px', color: '#666' }}>
        표시할 업체가 없습니다.
      </div>
    );
  }

  // items 배열을 순회하며 각 아이템에 대한 Card 컴포넌트를 생성하고 Link로 감싸 렌더링합니다.
  return (
    <>
      {items.map((item) => (
        // Link 컴포넌트로 Card를 감싸서, 카드 전체를 클릭 가능한 링크로 만듭니다.
        // to prop은 React Router가 이동할 경로를 지정합니다.
        // URL은 item의 type (예: 'cafe', 'hospital')과 id를 조합하여 동적으로 생성됩니다.
        // 기본 type이 없을 경우 'item'을 사용합니다. (예: /cafe/1, /hospital/3)
        <Link to={`/${item.type || 'item'}/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
          {/* 
            범용 Card 컴포넌트에 현재 item 데이터와 type을 전달하여 렌더링을 위임합니다.
            Card 컴포넌트는 전달받은 item 데이터와 type에 따라 적절한 스타일과 정보를 표시합니다.
            type이 없을 경우 'business'를 기본값으로 사용합니다.
          */}
          <Card item={item} type={item.type || 'business'} />
        </Link>
      ))}
    </>
  );
};

export default BusinessCardGrid; // BusinessCardGrid 컴포넌트를 내보냅니다.