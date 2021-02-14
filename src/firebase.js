import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDCSymC60Ee0MIl0mDvO7eLyi3yQFknAuY",
    authDomain: "givemelove-9d9d2.firebaseapp.com",
    projectId: "givemelove-9d9d2",
    storageBucket: "givemelove-9d9d2.appspot.com",
    messagingSenderId: "766275632568",
    appId: "1:766275632568:web:1cd0a46243e9f9b65ee34d",
    measurementId: "G-P4WZBWWNPQ"
  });

const db = firebaseApp.firestore();

// export the database for components to use
export { firebase, db };