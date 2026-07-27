/*
  ============================================================
  FIREBASE CONFIG — fill this in with YOUR project's values.
  ============================================================
  Firebase Console → Project settings (gear icon) → General tab →
  "Your apps" → Web app → SDK setup and configuration → Config.

  Paste the object Firebase gives you in place of the one below.
  Every value here is a placeholder and the site will NOT connect
  to Firebase until you replace them.
*/
const firebaseConfig = {
  apiKey: "AIzaSyApzmhWZRce5Hr8sTGvZo-CVfF-rsY7Ag4",
  authDomain: "projukti-s-website.firebaseapp.com",
  projectId: "projukti-s-website",
  storageBucket: "projukti-s-website.firebasestorage.app",
  messagingSenderId: "831602354813",
  appId: "1:831602354813:web:2e1aade0f4b6511e539f14",
  measurementId: "G-WVZZ3FYKVN"
};

firebase.initializeApp(firebaseConfig);

// Shared handles used by content-loader.js and admin.html
const db = firebase.firestore();
const auth = firebase.auth();

// The single Firestore document that stores every editable text field.
// Both index.html and contact.html read from this same document,
// which is why fields like the footer or phone numbers can be
// shared between pages using the same data-edit-id.
const CONTENT_DOC = db.collection('content').doc('site');
