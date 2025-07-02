import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import LessonCard from '../../components/LessonCard';
import { supabase } from '../../services/supabaseClient';
import NetInfo from '@react-native-community/netinfo';
import { saveLesson, getLesson } from '../../services/storageService';

export default function LessonListScreen({ route, navigation }) {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloaded, setDownloaded] = useState({});
  const courseId = route?.params?.courseId;

  useEffect(() => {
    if (courseId) fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch lessons for course
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId);
      if (error) throw error;
      // Fetch user progress for these lessons
      const { data: progress } = await supabase
        .from('userprogress')
        .select('lesson_id, status')
        .eq('user_id', user.id)
        .in('lesson_id', data.map(l => l.id));
      // Merge status into lessons
      const lessonsWithStatus = data.map(lesson => ({
        ...lesson,
        status: progress.find(p => p.lesson_id === lesson.id)?.status || 'not_started',
      }));
      setLessons(lessonsWithStatus);
      // Check which lessons are downloaded
      lessonsWithStatus.forEach(lesson => {
        getLesson(lesson.id, (cached) => {
          setDownloaded(prev => ({ ...prev, [lesson.id]: !!cached }));
        });
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = (lesson) => {
    navigation.navigate('Lesson', { lessonId: lesson.id, courseId });
  };

  const handleDownloadLesson = async (lesson) => {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      Alert.alert('Offline', 'You must be online to download lessons.');
      return;
    }
    saveLesson(lesson);
    setDownloaded(prev => ({ ...prev, [lesson.id]: true }));
    Alert.alert('Downloaded', 'Lesson cached for offline use.');
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

  return (
    <View style={styles.container}>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <LessonCard lesson={item} onPress={handleSelectLesson} />
            {downloaded[item.id] ? (
              <Text style={styles.downloaded}>Downloaded</Text>
            ) : (
              <Button title="Download for Offline" onPress={() => handleDownloadLesson(item)} />
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  error: { color: 'red', textAlign: 'center', marginTop: 32 },
  downloaded: { color: 'green', textAlign: 'center', marginBottom: 8 },
}); 