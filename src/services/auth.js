import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../config.js';

class AuthService {
  constructor() {
    this.user = null;
    this.userProfile = null;

    // Listen for auth state changes
    onAuthStateChanged(auth, async (user) => {
      this.user = user;
      if (user) {
        try {
          await this.loadUserProfile();
        } catch (error) {
          console.error('Error loading user profile:', error);
          // If profile doesn't exist, create it
          if (error.code === 'permission-denied') {
            await this.createUserProfile(user.email);
          }
        }
      } else {
        this.userProfile = null;
      }
    });
  }

  async loadUserProfile() {
    if (!this.user) throw new Error('No user logged in');
    
    const docRef = doc(db, 'users', this.user.uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // Create profile if it doesn't exist
      await this.createUserProfile(this.user.email);
      return this.loadUserProfile();
    }
    
    this.userProfile = docSnap.data();
    return this.userProfile;
  }

  async createUserProfile(email) {
    if (!this.user) throw new Error('No user logged in');
    
    const username = email.split('@')[0]; // Default username from email
    const userData = {
      username,
      coins: 0,
      createdAt: serverTimestamp(),
      purchases: [],
      email: email
    };

    await setDoc(doc(db, 'users', this.user.uid), userData);
    this.userProfile = userData;
    return userData;
  }

  async signUp(email, password, username) {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile
      await this.createUserProfile(email);
      
      return credential.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Send password reset email error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      this.user = null;
      this.userProfile = null;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  getCurrentUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.user;
  }

  async updateUserProfile(updates) {
    if (!this.user) throw new Error('No user logged in');
    
    const docRef = doc(db, 'users', this.user.uid);
    await setDoc(docRef, updates, { merge: true });
    await this.loadUserProfile();
    return this.userProfile;
  }
}

const authService = new AuthService();
export default authService; 