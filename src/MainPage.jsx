import React from 'react';
import styles from './MainPage.module.css';
import HeroSection from './components/common/HeroSection';
import CategoryNav from './components/common/CategoryNav';
import Card from './components/ui/Card';
import Button from './components/ui/Button';

// 임시 데이터
const featuredProfessionals = [
  { id: 1, name: '김미소 펫시터', specialty: '소형견/노견 전문', rating: 4.9, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400', description: '아이의 건강과 행복을 최우선으로 돌봅니다. 안심하고 맡겨주세요!' },
  { id: 2, name: '이세돌 훈련사', specialty: '문제행동 교정 전문가', rating: 4.8, image: 'https://images.unsplash.com/photo-1598875706250-21fa36d3975b?auto=format&fit=crop&q=80&w=400', description: '긍정강화 훈련으로 아이의 자신감을 키워줍니다. 상담 환영!' },
  { id: 3, name: '박사랑 그루머', specialty: '고양이/무마취 미용', rating: 5.0, image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&q=80&w=400', description: '스트레스 없는 편안한 미용을 약속합니다. 방문 미용 가능!' },
  { id: 4, name: '최건강 수의사', specialty: '내과/피부과 전문', rating: 4.7, image: 'https://images.unsplash.com/photo-1629864227702-8d75e0161a0c?auto=format&fit=crop&q=80&w=400', description: '정확한 진단과 따뜻한 마음으로 아이들을 치료합니다.' },
];

const latestCommunityPosts = [
    { id: 1, title: '[꿀팁] 강아지 산책 필수템 총정리!', author: '멍멍이아빠', image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&q=80&w=400', description: '우리 아이와 즐거운 산책을 위한 준비물! 놓치지 마세요.' },
    { id: 2, title: '[자랑] 우리 집 고양이 미모 보고 가세요', author: '집사일기', image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&q=80&w=400', description: '랜선 집사님들~ 우리 냥이 보고 힐링하세요!' },
    { id: 3, title: '[추천] 반려동물 동반 카페 리스트 (서울)', author: '여행가자', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400', description: '주말에 아이와 함께 갈 수 있는 서울 카페 모음.' },
];

const MainPage = () => {
  return (
    <>
      <HeroSection />
      <CategoryNav />
      
      <section className="container">
        <h2 className="section-title">PETMILY 추천 전문가 🤝</h2>
        <div className={styles.cardGrid}>
          {featuredProfessionals.map(item => <Card key={item.id} item={item} type="sitter" />)}
        </div>
        <div className={styles.moreButtonWrapper}>
          <Button variant="secondary" size="medium">더 많은 전문가 보기</Button>
        </div>
      </section>
      
      <section className={`${styles.magazineSection} container`}>
        <h2 className="section-title">PETMILY 매거진 & 커뮤니티 📚</h2>
        <div className={styles.cardGrid}>
          {latestCommunityPosts.map(item => <Card key={item.id} item={item} type="post" />)}
        </div>
        <div className={styles.moreButtonWrapper}>
          <Button variant="secondary" size="medium">커뮤니티 전체 보기</Button>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={`${styles.ctaContent} container`}>
            <div className={styles.ctaText}>
                <h3>PETMILY 맞춤 케어 솔루션 ✨</h3>
                <p>우리 아이의 견종, 나이, 환경에 딱 맞는 <strong>1:1 맞춤 케어 서비스</strong>를 경험해보세요.</p>
                <Button variant="primary" size="large">맞춤 케어 상담 신청</Button>
            </div>
            <div className={styles.ctaImage}>
                <img src="https://images.unsplash.com/photo-1555627197-604c6baf5c7a?auto=format&fit=crop&q=80&w=800" alt="PETMILY Care Service" />
            </div>
        </div>
      </section>
    </>
  );
};

export default MainPage;