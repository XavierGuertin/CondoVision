// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA0dkvX3tb390kt_2aj8OTNaF60KRQY4jk",
    authDomain: "soen-390-capstone.firebaseapp.com",
    projectId: "soen-390-capstone",
    storageBucket: "soen-390-capstone.appspot.com",
    messagingSenderId: "238400176061",
    appId: "1:238400176061:web:2898be7e39485fe9599cd4",
    measurementId: "G-NLVQRZC99Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Export the database for components to use.
export const db = getFirestore(app);