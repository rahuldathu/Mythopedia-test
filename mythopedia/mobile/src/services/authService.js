import { supabase } from './supabaseClient';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

// Google sign-in
export async function signInWithGoogle() {
  const redirectUrl = AuthSession.makeRedirectUri({ useProxy: true });
  const provider = 'google';
  const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: redirectUrl } });
  if (error) throw error;
  // The user will be redirected back to the app after auth
  return data;
}

// Apple sign-in
export async function signInWithApple() {
  const redirectUrl = AuthSession.makeRedirectUri({ useProxy: true });
  const provider = 'apple';
  const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: redirectUrl } });
  if (error) throw error;
  return data;
} 