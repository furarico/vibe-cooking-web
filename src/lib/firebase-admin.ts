import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';

const app = getApps().length === 0 ? initializeApp() : getApp();
const appCheck = getAppCheck(app);

export { app, appCheck };
