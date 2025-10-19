// Firebase connector (replace config + set USE_FIREBASE=true to go live)
export const USE_FIREBASE = false;
let app, db, auth;

export async function initFirebase() {
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js');
  const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js');
  const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js');
  const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  };
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  return { db, auth };
}

export async function fetchCollection(name) {
  if (!USE_FIREBASE) return window.__DATA__[name] || [];
  const { getFirestore, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js');
  const _db = db ?? getFirestore();
  const snapshot = await getDocs(collection(_db, name));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}
