import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDpKcNSfnV4Y8v-XqSxsCBIzwFFDtgDH7w',
  authDomain: 'employeemanagement-0.firebaseapp.com',
  projectId: 'employeemanagement-0',
  storageBucket: 'employeemanagement-0.firebasestorage.app',
  messagingSenderId: '274840997045',
  appId: '1:274840997045:web:83418c6c460787f75302fc',
  measurementId: 'G-WCQF9GQRK2'
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

