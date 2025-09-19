// src/components/sections/TestimonialSection.jsx
import React from 'react';
import styles from './TestimonialSection.module.css';
const testimonials = [
  {
    name: '김○○',
    petInfo: '골든리트리버 몽이 엄마',
    stars: 5,
    testimonial: '응급상황에서 정말 도움이 되었어요! 늦은 시간에도 바로 상담 연결이 돼서 안심할 수 있었습니다.',
    image: '/grooming_images/grooming1.jpg',
  },
  {
    name: '이○○',
    petInfo: '포메라니안 코코 아빠',
    stars: 5,
    testimonial: '믿고 맡길 수 있는 펜션을 찾았어요. 시설도 깔끔하고 사장님도 친절하셔서 여행 내내 마음이 편했습니다.',
    image: '/grooming_images/grooming2.jpg',
  },
  {
    name: '박○○',
    petInfo: '브리티시숏헤어 나비 엄마',
    stars: 5,
    testimonial: '초보 집사라 모르는 게 많았는데, 전문가 조언이 정말 유용해요. 덕분에 우리 나비가 더 건강해졌어요!',
    image: '/grooming_images/grooming3.jpg',
  },
  {
    name: '최○○',
    petInfo: '시바견 마루 형',
    stars: 5,
    testimonial: '산책 코스 추천 기능 최고! 매일 새로운 곳을 발견하는 재미가 쏠쏠합니다.',
    image: '/grooming_images/grooming4.png',
  },
  {
    name: '정○○',
    petInfo: '랙돌 두부 언니',
    stars: 5,
    testimonial: '커뮤니티에서 좋은 친구들을 많이 만났어요. 정보 교류는 물론, 정서적으로도 큰 힘이 됩니다.',
    image: '/grooming_images/grooming1.jpg',
  },
  {
    name: '윤○○',
    petInfo: '웰시코기 감자 누나',
    stars: 4,
    testimonial: '병원 예약 시스템이 조금 더 빨라지면 좋겠지만, 전반적으로 만족하며 사용하고 있습니다.',
    image: '/grooming_images/grooming2.jpg',
  },
  {
    name: '송○○',
    petInfo: '노르웨이숲 레오 아빠',
    stars: 5,
    testimonial: '프리미엄 사료 샘플 신청했는데, 우리 레오가 너무 잘 먹네요. 바로 본품 주문했습니다!',
    image: '/grooming_images/grooming3.jpg',
  },
  {
    name: '장○○',
    petInfo: '비숑프리제 구름이 이모',
    stars: 5,
    testimonial: '미용실 예약이 정말 편해졌어요. 스타일북 보고 바로 예약까지 할 수 있어서 좋아요.',
    image: '/grooming_images/grooming4.png',
  },
  {
    name: '임○○',
    petInfo: '믹스견 사랑이 형',
    stars: 5,
    testimonial: '유기견이었던 사랑이의 행동 문제 때문에 상담 받았는데, 전문가의 조언 덕분에 많이 나아졌습니다. 감사합니다.',
    image: '/grooming_images/grooming1.jpg',
  },
  {
    name: '한○○',
    petInfo: '스코티시폴드 별이 집사',
    stars: 5,
    testimonial: '호텔링 서비스 만족도 200%입니다. 실시간으로 사진도 보내주시고, 세심하게 케어해주셔서 감동받았어요.',
    image: '/grooming_images/grooming2.jpg',
  },
];

const TestimonialSection = () => {
  const renderStars = (count) => {
    let stars = '';
    for (let i = 0; i < count; i++) {
      stars += '★';
    }
    return stars;
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>신뢰할 수 있는 파트너, 삐삐 PetPotal</h2>
        <p className={styles.subtitle}>많은 반려인들이 삐삐 PetPotal과 함께하고 있습니다.</p>
        <div className={styles.scrollingWrapper}>
          <div className={styles.grid}>
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={index} className={styles.card}>
                <p className={styles.stars}>{renderStars(testimonial.stars)}</p>
                <p className={styles.testimonialText}>"{testimonial.testimonial}"</p>
                <div className={styles.authorInfo}>
                  <img src={testimonial.image} alt={testimonial.name} className={styles.profileImage} />
                  <div>
                    <p className={styles.name}>{testimonial.name}</p>
                    <p className={styles.petInfo}>{testimonial.petInfo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;