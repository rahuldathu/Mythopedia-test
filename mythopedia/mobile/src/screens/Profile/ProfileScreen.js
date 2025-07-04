import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, Switch, ScrollView, Modal, TouchableOpacity, Keyboard } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import AvatarUploader from '../../components/AvatarUploader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync, sendPushTokenToBackend, sendTestPushNotification, scheduleDailyLessonReminders, clearScheduledLessonReminders } from '../../services/notificationService';
import { useNavigation } from '@react-navigation/native';
import XPProgressBar from '../../components/XPProgressBar';
import { useSelector } from 'react-redux';
import achievementsList from '../../constants/achievements';
import * as Haptics from 'expo-haptics';
import { logFeedbackSubmit } from '../../services/analyticsService';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);
  const navigation = useNavigation();
  const xp = useSelector(state => state.progress.xp);
  const unlockedAchievements = useSelector(state => state.progress.achievements) || [];
  const streak = useSelector(state => state.progress.streak);
  const lessonProgress = useSelector(state => state.progress.lessonProgress) || {};
  const completedCourses = useSelector(state => state.progress.completedCourses) || [];
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState('General');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState(profile?.email || '');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
    getNotificationPref();
    getReminderPref();
  }, [user]);

  useEffect(() => {
    if (profile?.email) setFeedbackEmail(profile.email);
  }, [profile]);

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

  const getReminderPref = async () => {
    const value = await AsyncStorage.getItem('remindersEnabled');
    setRemindersEnabled(value === 'true');
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

  const handleReminderToggle = async (value) => {
    setReminderLoading(true);
    setRemindersEnabled(value);
    await AsyncStorage.setItem('remindersEnabled', value ? 'true' : 'false');
    if (value) {
      try {
        await scheduleDailyLessonReminders(7, 10, 0); // 7 days, 10:00 AM
        Alert.alert('Reminders Enabled', 'You will get daily lesson reminders even when offline.');
      } catch (e) {
        Alert.alert('Reminder Error', e.message);
      }
    } else {
      await clearScheduledLessonReminders();
    }
    setReminderLoading(false);
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

  const handleSendTestPush = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (!token) throw new Error('No push token');
      await sendTestPushNotification(token, 'This is a test push notification from Mythopedia!');
      showNotification('Test push notification sent!', 'success');
    } catch (e) {
      showNotification('Failed to send push notification', 'error');
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackMessage.trim()) return;
    setFeedbackSubmitting(true);
    Keyboard.dismiss();
    try {
      const { error } = await supabase.from('feedback').insert([
        {
          user_id: user.id,
          type: feedbackType,
          message: feedbackMessage,
          email: feedbackEmail,
        },
      ]);
      if (error) throw error;
      await logFeedbackSubmit(feedbackType);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Thank you!', 'Your feedback has been submitted.');
      setFeedbackVisible(false);
      setFeedbackMessage('');
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', e.message);
    } finally {
      setFeedbackSubmitting(false);
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
      <XPProgressBar xp={xp} xpToNextLevel={100} level={1} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
        {achievementsList.filter(a => unlockedAchievements.includes(a.id)).map(a => (
          <View key={a.id} style={{ alignItems: 'center', marginRight: 18 }}>
            <Text style={{ fontSize: 32 }}>{a.icon}</Text>
            <Text style={{ fontSize: 10, color: '#555', marginTop: 2 }}>{a.name}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{streak}</Text>
          <Text style={{ fontSize: 12, color: '#555' }}>Streak</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{Object.keys(lessonProgress).length}</Text>
          <Text style={{ fontSize: 12, color: '#555' }}>Lessons</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{completedCourses.length}</Text>
          <Text style={{ fontSize: 12, color: '#555' }}>Courses</Text>
        </View>
      </View>
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
      <View style={styles.notifRow}>
        <Text style={styles.label}>Daily Lesson Reminders (Offline)</Text>
        <Switch
          value={remindersEnabled}
          onValueChange={handleReminderToggle}
          disabled={reminderLoading}
        />
      </View>
      <View style={{ marginTop: 24 }}>
        <Button title="View Achievements" onPress={() => navigation.navigate('Achievements')} />
      </View>
      <View style={{ marginTop: 32 }}>
        <Button title="Logout" color="red" onPress={signOut} />
      </View>
      <View style={{ marginTop: 12 }}>
        <Button title="Send Test Push" onPress={handleSendTestPush} />
      </View>
      <Button title="Send Feedback" onPress={() => setFeedbackVisible(true)} />
      <Modal visible={feedbackVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, width: '90%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Send Feedback</Text>
            <Text style={{ marginBottom: 4 }}>Type</Text>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {['General', 'Bug', 'Suggestion'].map(type => (
                <TouchableOpacity key={type} onPress={() => setFeedbackType(type)} style={{ marginRight: 12 }}>
                  <Text style={{ color: feedbackType === type ? '#007AFF' : '#333', fontWeight: feedbackType === type ? 'bold' : 'normal' }}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ marginBottom: 4 }}>Message</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 8, minHeight: 60 }}
              multiline
              value={feedbackMessage}
              onChangeText={setFeedbackMessage}
              placeholder="Describe your feedback..."
            />
            <Text style={{ marginBottom: 4 }}>Email (optional)</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 12 }}
              value={feedbackEmail}
              onChangeText={setFeedbackEmail}
              placeholder="Your email (optional)"
              keyboardType="email-address"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button title="Cancel" onPress={() => setFeedbackVisible(false)} />
              <View style={{ width: 12 }} />
              {feedbackSubmitting && <ActivityIndicator size="small" style={{ position: 'absolute', right: 24, top: 12 }} />}
              <Button title={feedbackSubmitting ? '' : 'Submit'} onPress={handleFeedbackSubmit} disabled={feedbackSubmitting || !feedbackMessage.trim()} />
            </View>
          </View>
        </View>
      </Modal>
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