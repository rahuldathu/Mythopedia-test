import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, Share, ToastAndroid, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import NetInfo from '@react-native-community/netinfo';
import { getLesson, saveLesson } from '../../services/storageService';
import QuizLesson from './types/QuizLesson';
import MatchLesson from './types/MatchLesson';
import FillInLesson from './types/FillInLesson';
import ImageMatchLesson from './types/ImageMatchLesson';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { logShare } from '../../services/analyticsService';

export default function LessonScreen({ route, navigation }) {
  const { user } = useAuth();
  const { lessonId, courseId } = route.params;
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    setLoading(true);
    setError('');
    try {
      const net = await NetInfo.fetch();
      if (!net.isConnected) {
        // Load from local cache
        getLesson(lessonId, (cached) => {
          if (cached) setLesson(cached);
          else setError('Lesson not available offline.');
          setLoading(false);
        });
        return;
      }
      // Online: fetch from backend
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      if (error) throw error;
      setLesson(data);
      saveLesson(data); // Cache for offline
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (isCorrect = true) => {
    // Mark lesson as complete and award XP (e.g., 10 XP)
    navigation.replace('LessonResult', { xp: isCorrect ? 10 : 5 });
  };

  const handleShareLesson = async () => {
    const url = Linking.createURL(`/lesson/${lessonId}`);
    await Clipboard.setStringAsync(url);
    await logShare('share', lessonId, 'lesson');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Link copied to clipboard!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Link copied to clipboard!');
    }
    await Share.share({ message: `Check out this lesson on Mythopedia! ${url}` });
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
  if (!lesson) return null;

  // Render lesson content based on type
  let content = null;
  switch (lesson.type) {
    case 'text':
      content = <Text style={styles.content}>{lesson.content.text}</Text>;
      break;
    case 'quiz':
      content = <QuizLesson lesson={lesson} onComplete={handleComplete} />;
      break;
    case 'match':
      content = <MatchLesson lesson={lesson} onComplete={handleComplete} />;
      break;
    case 'fill-in':
      content = <FillInLesson lesson={lesson} onComplete={handleComplete} />;
      break;
    case 'image-match':
      content = <ImageMatchLesson lesson={lesson} onComplete={handleComplete} />;
      break;
    default:
      content = <Text>Unsupported lesson type: {lesson.type}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lesson</Text>
      {content}
      <Button title="Share Lesson" onPress={handleShareLesson} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  content: { fontSize: 18, marginBottom: 24, textAlign: 'center' },
  error: { color: 'red', textAlign: 'center', marginTop: 32 },
}); 