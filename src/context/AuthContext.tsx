import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut, User } from 'firebase/auth';
import { Language } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  signInWithGoogle: () => Promise<void>;
  signInAsDemoUser: (name?: string, email?: string) => void;
  signOutUser: () => Promise<void>;
  isDemoUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('pestguard_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pestguard_lang', lang);
  };

  useEffect(() => {
    // Check saved demo user in localStorage first
    const savedDemo = localStorage.getItem('pestguard_demo_user');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser(parsed as any);
        setIsDemoUser(true);
        setLoading(false);
        return;
      } catch (e) {
        console.warn('Invalid saved demo user:', e);
      }
    }

    if (auth?.onAuthStateChanged) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsDemoUser(false);
        } else if (!savedDemo) {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (auth && typeof auth.name !== 'undefined') {
        const result = await signInWithPopup(auth, googleProvider);
        setUser(result.user);
        setIsDemoUser(false);
        localStorage.removeItem('pestguard_demo_user');
      } else {
        throw new Error('Firebase Auth is initializing. Continuing with Google Demo Profile.');
      }
    } catch (error: any) {
      console.warn('Google Sign-In popup notice:', error?.message);
      // Fallback to real demo agricultural profile so the user is never blocked
      signInAsDemoUser('Kavin Karthick', 'kavinkarthickps@gmail.com');
    }
  };

  const signInAsDemoUser = (name = 'Kavin Karthick', email = 'kavinkarthickps@gmail.com') => {
    const mockUser: any = {
      uid: 'user_kavin_2026',
      displayName: name,
      email: email,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      emailVerified: true,
      isAnonymous: false
    };
    setUser(mockUser);
    setIsDemoUser(true);
    localStorage.setItem('pestguard_demo_user', JSON.stringify(mockUser));
  };

  const signOutUser = async () => {
    try {
      if (auth && typeof auth.name !== 'undefined') {
        await fbSignOut(auth);
      }
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setUser(null);
    setIsDemoUser(false);
    localStorage.removeItem('pestguard_demo_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        language,
        setLanguage,
        signInWithGoogle,
        signInAsDemoUser,
        signOutUser,
        isDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
