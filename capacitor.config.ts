import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.djessemann.roguesgallery',
  appName: "Rogue's Gallery",
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#000000',
    preferredContentMode: 'mobile'
  },
  server: {
    // Disable the webview's bouncing/scrolling behavior
    iosScheme: 'capacitor'
  }
};

export default config;
