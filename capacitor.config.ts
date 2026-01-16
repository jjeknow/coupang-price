import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ddokcheck.app',
  appName: '똑체크',
  webDir: 'out',

  // 서버 설정 (프로덕션에서는 웹 URL 사용)
  server: {
    url: 'https://ddokcheck.com',
    cleartext: false,
  },

  // iOS 설정
  ios: {
    scheme: 'DdokCheck',
    contentInset: 'automatic',
    backgroundColor: '#ffffff',
    preferredContentMode: 'mobile',
    // 스크롤 동작 개선
    scrollEnabled: true,
    // 풀다운 새로고침
    allowsLinkPreview: true,
  },

  // 플러그인 설정
  plugins: {
    // 푸시 알림
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    // 스플래시 스크린
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#3182f6',
      splashFullScreen: true,
      splashImmersive: true,
    },
    // 상태바
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#ffffff',
    },
    // 키보드
    Keyboard: {
      resizeOnFullScreen: true,
    },
    // 로컬 알림
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#3182f6',
      sound: 'default',
    },
  },
};

export default config;
