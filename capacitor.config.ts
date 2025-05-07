import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.leonardo.inout',
  appName: 'InOut',
  webDir: 'build',
  server: {
    allowNavigation: ['capacitor://localhost'],
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["password"],
    },
  },
};

export default config;