
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

// CONFIGURAÇÕES DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyB5AOiH8WetLCENVFm0l9Y1PBSEnTgi2QI",
  authDomain: "compra-facil-a608f.firebaseapp.com",
  projectId: "compra-facil-a608f",
  storageBucket: "compra-facil-a608f.firebasestorage.app",
  messagingSenderId: "564175607230",
  appId: "1:564175607230:web:2301fb26c435a2f6be15ef"
};

// INICIALIZAÇÃO DO FIREBASE
const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// BANCO DE DADOS
export const db = getFirestore(app);

// AUTENTICAÇÃO COM ARMAZENAMENTO NO DISPOSITIVO
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

export { auth };
