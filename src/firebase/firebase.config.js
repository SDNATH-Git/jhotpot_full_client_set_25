// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
//   apiKey: "AIzaSyBygc0kY2GRT-CVCz4Eg9WlQvQirNtzwBI",
//   authDomain: "food-sharing-1821c.firebaseapp.com",
//   projectId: "food-sharing-1821c",
//   storageBucket: "food-sharing-1821c.firebasestorage.app",
//   messagingSenderId: "537019445724",
//   appId: "1:537019445724:web:fc687f2d958737de83df19"

  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;