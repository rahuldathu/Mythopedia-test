import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../services/supabaseClient';
import { logLogin } from '../services/analyticsService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const session = supabase.auth.getSession();
    session.then(({ data }) => {
      setUser(data?.session?.user || null);
      setLoading(false);
    });
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session) {
        SecureStore.setItemAsync('sb_token', session.access_token);
      } else {
        SecureStore.deleteItemAsync('sb_token');
      }
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
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
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 