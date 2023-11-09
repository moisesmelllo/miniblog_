import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyD3hO31lIujcCmMv4IXFRm7CFlGEY0_Z0o",
  authDomain: "miniblog-503aa.firebaseapp.com",
  projectId: "miniblog-503aa",
  storageBucket: "miniblog-503aa.appspot.com",
  messagingSenderId: "198012890019",
  appId: "1:198012890019:web:185ed7761a92f9551b8816"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

