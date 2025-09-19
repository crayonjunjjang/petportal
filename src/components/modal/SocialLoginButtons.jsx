
// src/components/modal/SocialLoginButtons.jsx
import React from 'react';
import styles from './SocialLoginButtons.module.css';

// Import PNG logos
import naverLogo from '../../assets/image/naver.png';
import googleLogo from '../../assets/image/google.png';

const KakaoIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24">
    <path fill="#3C1E1E" d="M16 4.6c-6.2 0-11.2 4.2-11.2 9.4s5 9.4 11.2 9.4c1.9 0 3.8-.4 5.4-1.2l3.2 2.2-1.9-3c2.3-1.7 3.7-4.2 3.7-6.9 0-5.2-5-9.4-11.2-9.4z"/>
  </svg>
);

const socialProviders = [
  {
    name: 'kakao',
    text: '카카오로 시작하기', // Keep text for now, will remove span later
    icon: <KakaoIcon />,
    className: styles.kakao,
  },
  {
    name: 'naver',
    text: '네이버로 시작하기',
    icon: <img src={naverLogo} alt="네이버" className={styles.logoImage} />,
    className: styles.naver,
  },
  {
    name: 'google',
    text: 'Google로 시작하기',
    icon: <img src={googleLogo} alt="Google" className={styles.logoImage} />,
    className: styles.google,
  },
];

const SocialLoginButtons = () => {
  const handleSocialLogin = (providerName) => {
    console.log(`${providerName} login initiated`);
    // Add actual login logic here
  };

  return (
    <div className={styles.socialButtonContainer}>
      {socialProviders.map((provider) => (
        <button
          key={provider.name}
          className={`${styles.socialButton} ${provider.className}`}
          onClick={() => handleSocialLogin(provider.name)}
        >
          <span className={styles.socialIcon}>{provider.icon}</span>
          <span className={styles.buttonText}>{provider.text}</span>
        </button>
      ))}
    </div>
  );
};

export default SocialLoginButtons;
