import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { useNotification } from '../src/context/NotificationContext';
import { useSelector } from 'react-redux';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { showNotification } = useNotification();
  const xp = useSelector((state: any) => state.progress.xp);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Email: {user?.email}</Text>
      <Text style={styles.label}>XP: {xp}</Text>
      <Button title="View Achievements" onPress={() => router.push('/achievements')} />
      <Button title="Show Notification" onPress={() => showNotification('Profile loaded!')} />
      <Button title="Logout" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    marginBottom: 16,
  },
}); 