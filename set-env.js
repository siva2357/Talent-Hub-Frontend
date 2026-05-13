const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envConfigFile = `export const environment = {
  production: false,
  apiGatewayUrl: '${process.env.DEV_API_GATEWAY_URL}',
  generativeAIUrl: '${process.env.DEV_GENERATIVE_AI_URL}',
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
    measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}'
  }
};
`;

const prodEnvConfigFile = `export const environment = {
  production: true,
  apiGatewayUrl: '${process.env.PROD_API_GATEWAY_URL}',
  generativeAIUrl: '${process.env.PROD_GENERATIVE_AI_URL}',
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
    measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}'
  }
};
`;

const dirPath = path.join(__dirname, 'src', 'environments');
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(path.join(dirPath, 'environment.ts'), envConfigFile);
fs.writeFileSync(path.join(dirPath, 'environment.prod.ts'), prodEnvConfigFile);

console.log('Environment files generated successfully.');
