import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA_UzzFc53k3zD1PpX_v1WlKL4F5llMqiI",
  authDomain: "bhutan-7875d.firebaseapp.com",
  projectId: "bhutan-7875d",
  storageBucket: "bhutan-7875d.firebasestorage.app",
  messagingSenderId: "770131812484",
  appId: "1:770131812484:web:c34ab171a1ff8c983b22d1",
  measurementId: "G-NNLLDBC1KH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;