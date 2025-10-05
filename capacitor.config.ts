import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cd2ff5dc2e1c4f08b3ca7e49db5b9c72',
  appName: 'Pavilo - Billing Software',
  webDir: 'dist',
  server: {
    url: 'https://cd2ff5dc-2e1c-4f08-b3ca-7e49db5b9c72.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0066cc',
      showSpinner: false,
    },
  },
};

export default config;