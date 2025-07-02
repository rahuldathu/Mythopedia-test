import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, Switch } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import AvatarUploader from '../../components/AvatarUploader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync, sendPushTokenToBackend } from '../../services/notificationService';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    getNotificationPref();
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, username, avatar_url')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      setProfile(data);
      setUsername(data.username || '');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationPref = async () => {
    const value = await AsyncStorage.getItem('notificationsEnabled');
    setNotificationsEnabled(value === 'true');
  };

  const handleNotificationToggle = async (value) => {
    setNotifLoading(true);
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notificationsEnabled', value ? 'true' : 'false');
    if (value) {
      // Register and send token
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) await sendPushTokenToBackend(token, user.id);
      } catch (e) {
        Alert.alert('Notification Error', e.message);
      }
    } else {
      // Optionally: remove token from backend
      // await fetch('http://localhost:4000/api/profile/push-token', { method: 'DELETE', headers: { 'Authorization': `Bearer ${user.id}` } });
    }
    setNotifLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const { error } = await supabase
        .from('users')
        .update({ username })
        .eq('id', user.id);
      if (error) throw error;
      Alert.alert('Success', 'Profile updated');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (url) => {
    setSaving(true);
    setError('');
    try {
      const { error } = await supabase
        .from('users')
        .update({ avatar_url: url })
        .eq('id', user.id);
      if (error) throw error;
      setProfile({ ...profile, avatar_url: url });
      Alert.alert('Success', 'Avatar updated');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }
  if (!profile) return null;

  return (
    <View style={styles.container}>
      <AvatarUploader avatarUrl={profile.avatar_url} onUpload={handleAvatarUpload} userId={user.id} />
      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{profile.email}</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <Button title={saving ? 'Saving...' : 'Save'} onPress={handleSave} disabled={saving} />
      <View style={styles.notifRow}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationToggle}
          disabled={notifLoading}
        />
      </View>
      <View style={{ marginTop: 32 }}>
        <Button title="Logout" color="red" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f5f5' },
  label: { fontWeight: 'bold', marginTop: 16 },
  value: { marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  error: { color: 'red', textAlign: 'center', marginTop: 32 },
  notifRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 },
}); 