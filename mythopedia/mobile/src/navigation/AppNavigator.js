import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null; // or a loading spinner

  return user ? <MainNavigator /> : <AuthNavigator />;
} 