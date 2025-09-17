const firebaseConfig = {
  apiKey: "AIzaSyDSGX6_ZAOLU_zAE-goZ8XHVZmFamrMg-Y",
  authDomain: "livraison-tiqa-1.firebaseapp.com",
  databaseURL: "https://livraison-tiqa-1-default-rtdb.firebaseio.com",
  projectId: "livraison-tiqa-1",
  storageBucket: "livraison-tiqa-1.firebasestorage.app",
  messagingSenderId: "643443463940",
  appId: "1:643443463940:web:3a1e8d043d0aa693016251",
  measurementId: "G-6T6KHPXBZW"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();