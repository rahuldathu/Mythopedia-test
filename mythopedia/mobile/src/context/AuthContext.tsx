import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../services/supabaseClient';
import { logLogin } from '../services/analyticsService';
import { useDispatch } from 'react-redux';
import { setXP } from '../store/progressSlice';
import { User } from '@supabase/supabase-js';

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email, password) => Promise<any>;
  signUp: (email, password) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        SecureStore.setItemAsync('sb_token', session.access_token);
      } else {
        SecureStore.deleteItemAsync('sb_token');
      }
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
    await SecureStore.setItemAsync('sb_token', data.session.access_token);
    await logLogin('email');
    return data;
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setUser(data.user);
    await SecureStore.setItemAsync('sb_token', data.session.access_token);
    await logLogin('register');
    dispatch(setXP(25));
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    await SecureStore.deleteItemAsync('sb_token');
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 