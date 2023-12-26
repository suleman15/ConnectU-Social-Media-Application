


import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVtwPC-mh20b9dfhD1JiPKZgSlORfqnC4",
    authDomain: "mern-test-1-34837.firebaseapp.com",
    projectId: "mern-test-1-34837",
    storageBucket: "mern-test-1-34837.appspot.com",
    messagingSenderId: "816759664307",
    appId: "1:816759664307:web:b555489ade8efff5c2cac6"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const googleProvider = new GoogleAuthProvider();