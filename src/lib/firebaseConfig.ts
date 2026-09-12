import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export interface FirebaseAppletConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  measurementId?: string;
  oAuthClientId?: string;
  recaptchaSiteKey?: string;
}

const config: FirebaseAppletConfig = require('../../firebase-applet-config.json');

export { config as firebaseConfig };
export default config;
