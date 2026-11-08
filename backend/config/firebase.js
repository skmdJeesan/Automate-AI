import { cert, initializeApp } from 'firebase-admin/app'
import service_account from '../serviceAccountKey.json' with { type: 'json' }

export const app = initializeApp({
  credential: cert(service_account)
});
