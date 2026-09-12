import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const config = require('../../firebase-applet-config.json');

export { config as firebaseConfig };
export default config;
