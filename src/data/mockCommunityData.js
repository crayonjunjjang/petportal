export const initialBoardData = {
    'free-talk': {
      name: '자유게시판',
      description: '반려동물에 대한 이야기를 자유롭게 나눠보세요.',
      notices: [{
        id: 'notice-1',
        title: '[필독] PETMILY 커뮤니티 이용 규칙 안내',
        author: '관리자',
        createdAt: '2025-09-08',
        views: 999,
        likes: 9999,
        content: `PETMILY에 오신 모든 반려인 여러분, 환영합니다!
  모두가 즐겁고 유익한 정보를 얻어갈 수 있는 공간을 위해 아래의 커뮤니티 이용 규칙을 꼭 지켜주세요.
  
  **제1조 (존중과 배려)**
  1. 모든 회원에게 존댓말 사용을 원칙으로 하며, 상호 존중하는 언어를 사용해주세요.
  2. 비난, 욕설, 타인에게 불쾌감을 주는 언어 사용을 금지합니다.
  3. 특정 회원에 대한 저격, 조롱, 공개적인 비판을 금지합니다.
  
  **제2조 (게시글 작성 원칙)**
  1. 각 게시판의 성격에 맞는 글을 작성해주세요. (예: 펫 자랑은 '펫 자랑 게시판'에)
  2. 제목은 내용을 유추할 수 있도록 명확하게 작성해주세요. (예: '도와주세요' X, '강아지가 갑자기 토하는데 왜 그럴까요?' O)
  3. 타인의 게시물이나 사진을 무단으로 도용하는 것을 금지합니다.
  
  **제3조 (금지 사항)**
  1. 상업적 목적의 홍보, 광고성 게시글 및 댓글 작성을 금지합니다. (단, 제휴된 업체는 지정된 게시판에서만 활동 가능)
  2. 불법적인 정보를 공유하거나, 불법 행위를 조장하는 내용을 금지합니다.
  3. 개인정보(실명, 연락처, 주소 등)가 포함된 게시글 작성에 유의해주세요.
  
  **제4조 (나눔/분양 게시판 특별 규칙)**
  1. 생명에 대한 책임감을 최우선으로 합니다. 신중하게 결정해주세요.
  2. '가정분양' 게시글 작성 시, 동물보호법에 저촉되지 않는 선에서 정보를 명확히 기재해야 합니다.
  3. 과도한 책임비 요구 등 금전적 이득을 취하려는 목적으로 판단될 경우 제재될 수 있습니다.
  
  **제5조 (제재 조치)**
  위 규칙을 위반하는 게시글이나 댓글은 무통보 삭제될 수 있으며, 반복적인 위반 시 경고, 활동 정지, 강제 탈퇴 등의 조치가 취해질 수 있습니다.
  
  모두가 행복한 반려 생활을 공유하는 PETMILY가 될 수 있도록 많은 협조 부탁드립니다.
  감사합니다.`,
        comments: [] 
        }],
        posts: [
          { id: 1, title: '저희 집 강아지 미모 좀 보세요!!', author: '멍멍이아빠', createdAt: '2025-09-09', views: 123, likes: 108, content: `정말 귀엽지 않나요?
팔불출인거 알지만 너무 예뻐서 올립니다.`, comments: [
          { id: 1, author: '집사일기', content: '와 정말 인형 같아요!', createdAt: '2025-09-09',likes: 1 },
          { id: 2, author: '산책러', content: '심장이 아프네요... 너무 귀여워서', createdAt: '2025-09-10',likes: 2 },
        ]},
        { id: 2, title: '고양이 사료 추천 부탁드립니다.', author: '집사일기', createdAt: '2025-09-09', views: 254, likes: 12,content: `1살된 코숏인데 어떤 사료가 좋을까요?
기호성 좋은 걸로 추천해주세요.`, comments: [] },
      ],
    },
    'pet-showcase': {
      name: '펫 자랑 게시판',
      description: '사랑스러운 반려동물의 사진과 영상을 마음껏 자랑해주세요.',
      notices: [{ id: 'notice-2', title: '[이벤트] 댕댕이 자랑 대회! 1등 선물은?', author: '관리자', createdAt: '2025-09-07', views: 876, likes: 58, content: '여러분의 사랑스러운 반려동물을 자랑해주세요!', comments: [] }],
      posts: [
          { id: 1, title: '새로 산 옷 입고 한 컷!', author: '패셔니스타', createdAt: '2025-09-10', views: 150, likes: 23, content: `이번에 새로 산 꼬까옷입니다.
너무 잘 어울리죠?`, comments: [] },
          { id: 2, title: '고양이 꾹꾹이 ASMR', author: '꾹꾹장인', createdAt: '2025-09-09', views: 210, likes: 30, content: '골골송과 함께하는 꾹꾹이 영상입니다. 힐링하고 가세요~', comments: [] },
      ],
    },
    'info-share': {
      name: '정보공유 게시판',
      description: '사료, 간식, 병원, 꿀팁 등 유용한 정보를 공유해요.',
      notices: [],
      posts: [
          { id: 1, title: '강아지 발바닥 습진 관리 꿀팁 공유합니다', author: '알쓸신잡', createdAt: '2025-09-10', views: 188,likes: 40, content: '여름철만 되면 고생하는 아이들 발바닥!', comments: [] },
          { id: 2, title: '믿고 가는 동물병원 리스트 (서울 강남)', author: '강남주민', createdAt: '2025-09-08', views: 302,likes: 52, content: '과잉진료 없고 설명 잘해주시는 병원들', comments: [] }
      ]
    },
    'qna': {
      name: 'Q&A 게시판',
      description: '반려동물을 키우면서 궁금한 점을 물어보세요.',
      notices: [],
      posts: [
          { id: 1, title: '고양이가 자꾸 화장실 말고 다른 곳에 소변을 봐요 ㅠㅠ', author: '초보집사', createdAt: '2025-09-09', views: 255,likes: 11, content: '...', comments: [] },
          { id: 2, title: '강아지가 갑자기 뒷다리를 절뚝거리는데 왜 그럴까요?', author: '걱정태산', createdAt: '2025-09-07', views: 411,likes: 29, content: '...', comments: [] },
      ]
    },
    'adoption': {
      name: '나눔/분양 게시판',
      description: '따뜻한 마음을 나눠주세요.',
      notices: [],
      posts: [
          { id: 1, title: '[무료나눔] 강아지 이동장, 하네스 나눔합니다.', author: '이사준비', createdAt: '2025-09-06', views: 101,likes: 5, content: '...', comments: [] },
          { id: 2, title: '[가정분양] 애교 많은 아깽이의 평생 가족을 찾습니다.', author: '사랑이네', createdAt: '2025-09-05', views: 520,likes: 78, content: '...', comments: [] },
      ]
    },
    'meetups': {
      name: '산책/모임 게시판',
      description: '지역별 산책 친구, 정기 모임을 찾아보세요.',
      notices: [],
      posts: [
          { id: 1, title: '[분당] 주말에 율동공원 산책하실 분 구해요!', author: '분당주민', createdAt: '2025-09-10', views: 88,likes: 8, content: '...', comments: [] },
          { id: 2, title: '[서울] 대형견 정기 모임 회원 모집합니다.', author: '댕댕클럽', createdAt: '2025-09-08', views: 129, likes: 21,content: '...', comments: [] },
      ]
    },
    'missing': {
      name: '실종/보호 게시판',
      description: '소중한 가족을 찾습니다.',
      notices: [],
      posts: [
          { id: 1, title: '[찾습니다] 서울시 마포구에서 코숏 고양이를 잃어버렸습니다.', author: '애타는마음', createdAt: '2025-09-09', views: 345, likes: 33,content: '...', comments: [] },
          { id: 2, title: '[보호중] 경기도 수원시에서 발견한 말티즈 주인 찾습니다.', author: '천사집사', createdAt: '2025-09-09', views: 280, likes: 47,content: '...', comments: [] },
      ]
    },
    'reviews': {
      name: '펫 동반 장소 후기',
      description: '함께 갈 수 있는 멋진 장소를 추천해주세요.',
      notices: [],
      posts: [
          { id: 1, title: '강릉 애견동반 카페 ‘멍푸치노’ 찐후기!', author: '여행가자', createdAt: '2025-09-07', views: 480, likes: 51,content: '...', comments: [] },
          { id: 2, title: '남양주 애견운동장 ‘뛰어놀개’ 다녀왔어요.', author: '에너자이저', createdAt: '2025-09-06', views: 390,likes: 34, content: '...', comments: [] },
      ],
    },
  };