// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQfwBgwuhVuaeJtBK8pc2JjKOAXSZ0_Yg",
  authDomain: "coachshala.firebaseapp.com",
  projectId: "coachshala",
  storageBucket: "coachshala.appspot.com",
  messagingSenderId: "199471703181",
  appId: "1:199471703181:web:fde8af674ccb94d288aec4",
  measurementId: "G-ERVXVRXPPC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);