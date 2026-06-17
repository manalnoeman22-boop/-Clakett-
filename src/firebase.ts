/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  orderBy,
  updateDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { CartItem, CreativeNote, SavedSetup } from './types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Provider with safe standard scopes to prevent unverified app warnings
export const googleProvider = new GoogleAuthProvider();
const SCOPES = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

SCOPES.forEach(scope => googleProvider.addScope(scope));

// Flags & token caching
let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Re-fetch helper in case token is saved/restored
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // We might need to login again to get the accessToken
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve Google Workspace Access Token');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Sign-in failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/* --- Firestore Persistence Helpers --- */

// Save Cart to Firestore
export const saveCartToFirestore = async (userId: string, cartItems: CartItem[]) => {
  try {
    // Save to local storage first as an immediate robust ground truth fallback
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));

    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, { items: cartItems, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.warn('Firestore offline/disabled. Saved cart to local offline cache:', error);
  }
};

// Retrieve Cart from Firestore
export const getCartFromFirestore = async (userId: string): Promise<CartItem[]> => {
  const localCartStr = localStorage.getItem(`cart_${userId}`);
  const localCart = localCartStr ? JSON.parse(localCartStr) : [];

  try {
    const cartRef = doc(db, 'carts', userId);
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
      const items = cartSnap.data().items || [];
      // Sync local cache with Firestore data if Firestore has data
      if (items.length > 0) {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
        return items;
      }
    }
  } catch (error) {
    console.warn('Firestore cart fetch failed (offline/network). serving local cached cart:', error);
  }
  return localCart;
};

// Save a user's customized Setup
export const saveSetupToFirestore = async (userId: string, setup: Omit<SavedSetup, 'id' | 'userId'>): Promise<string> => {
  const localSetupsStr = localStorage.getItem(`setups_${userId}`);
  const localSetups: SavedSetup[] = localSetupsStr ? JSON.parse(localSetupsStr) : [];
  const tempId = `setup-local-${Date.now()}`;
  const newSetup: SavedSetup = { ...setup, id: tempId, userId };
  localSetups.push(newSetup);
  localStorage.setItem(`setups_${userId}`, JSON.stringify(localSetups));

  try {
    const docRef = await addDoc(collection(db, 'saved_setups'), {
      ...setup,
      userId,
      createdAt: new Date().toISOString()
    });
    // Update local cache with real Firestore ID
    const updated = localSetups.map(s => s.id === tempId ? { ...s, id: docRef.id } : s);
    localStorage.setItem(`setups_${userId}`, JSON.stringify(updated));
    return docRef.id;
  } catch (error) {
    console.warn('Error saving custom setup to Firestore, saved to local cache:', error);
    return tempId;
  }
};

// Get user's customized Setups
export const getSavedSetups = async (userId: string): Promise<SavedSetup[]> => {
  const localSetupsStr = localStorage.getItem(`setups_${userId}`);
  const localSetups = localSetupsStr ? JSON.parse(localSetupsStr) : [];

  try {
    const q = query(collection(db, 'saved_setups'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const setups: SavedSetup[] = [];
    snap.forEach(docSnap => {
      setups.push({ id: docSnap.id, ...docSnap.data() } as SavedSetup);
    });
    if (setups.length > 0) {
      localStorage.setItem(`setups_${userId}`, JSON.stringify(setups));
      return setups;
    }
  } catch (error) {
    console.warn('Error fetching saved setups from Firestore, serving local cache:', error);
  }
  return localSetups;
};

// Notes for Scripts
export const saveNote = async (userId: string, title: string, content: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'notes'), {
      userId,
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
};

export const updateNote = async (noteId: string, title: string, content: string) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      title,
      content,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating note:', error);
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};

export const getNotes = async (userId: string): Promise<CreativeNote[]> => {
  try {
    const q = query(collection(db, 'notes'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const notes: CreativeNote[] = [];
    snap.forEach(docSnap => {
      notes.push({ id: docSnap.id, ...docSnap.data() } as CreativeNote);
    });
    return notes.sort((a,b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};
