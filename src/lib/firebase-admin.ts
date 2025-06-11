import { getApp, getApps, initializeApp } from 'firebase-admin/app';

const app = getApps().length === 0 ? initializeApp() : getApp();

export { app };
