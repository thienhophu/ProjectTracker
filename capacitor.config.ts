import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.projecttracker.app',
  appName: 'Project Tracker',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: false,
      backgroundColor: '#ffffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true,
    },
  },
};

export default config;
