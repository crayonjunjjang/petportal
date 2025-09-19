// src/utils/petData.js

export const DOG_BREEDS = [
  '포메라니안', '치와와', '말티즈', '요크셔테리어', '시바견', 
  '골든 리트리버', '래브라도 리트리버', '허스키', '보더 콜리', '진돗개',
  '푸들', '비숑 프리제', '웰시 코기', '닥스훈트', '불독',
  '비글', '슈나우저', '사모예드', '로트와일러', '도베르만',
  '세인트 버나드', '아프간 하운드', '그레이트 데인', '마스티프', '기타'
];

export const CAT_BREEDS = [
  '페르시안', '샴', '러시안 블루', '메인쿤', '벵갈',
  '브리티시 숏헤어', '스코티시 폴드', '아메리칸 숏헤어', '터키시 앙고라', '노르웨이 숲',
  '렉돌', '싱가푸라', '아비시니안', '이집션 마우', '봄베이',
  '버마', '히말라얀', '소말리', '발리니즈', '기타'
];

export const PET_TYPES = [
  { value: 'dog', label: '강아지', breeds: DOG_BREEDS },
  { value: 'cat', label: '고양이', breeds: CAT_BREEDS },
  { value: 'other', label: '기타', breeds: ['햄스터', '토끼', '새', '파충류', '기타'] }
];

export const GENDERS = [
  { value: 'male', label: '수컷' },
  { value: 'female', label: '암컷' },
  { value: 'unknown', label: '모름' }
];

// 나이 자동 계산 함수
export const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return Math.max(0, age);
};

// 기본 반려동물 데이터
export const DEFAULT_PET = {
  id: 1,
  name: '몽이',
  type: 'dog',
  breed: '포메라니안',
  gender: 'male',
  birthDate: '2021-03-15',
  weight: 3.2,
  profileImage: '/src/assets/images/profiles/default-dog.svg'
};