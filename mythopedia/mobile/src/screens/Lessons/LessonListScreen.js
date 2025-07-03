import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, Alert, Animated } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import LessonCard from '../../components/LessonCard';
import { supabase } from '../../services/supabaseClient';
import NetInfo from '@react-native-community/netinfo';
import { saveLesson, getLesson } from '../../services/storageService';
import { getOfflineLessons } from '../../database/wmUtils';
import { logLessonView } from '../../services/analyticsService';
import { LinearGradient } from 'expo-linear-gradient';

export default function LessonListScreen({ route, navigation }) {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloaded, setDownloaded] = useState({});
  const courseId = route?.params?.courseId;
  const [isOffline, setIsOffline] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    if (courseId) fetchLessons();
    return () => unsubscribe();
  }, [courseId]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [lessons]);

  const fetchLessons = async () => {
    setLoading(true);
    setError('');
    try {
      if (isOffline) {
        const offlineLessons = await getOfflineLessons(courseId);
        setLessons(offlineLessons);
      } else {
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
      }
      if (lessons.length > 0) {
        lessons.forEach(lesson => logLessonView(lesson.id, lesson.title));
      }
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
    <LinearGradient
      colors={['#2b1055', '#7597de', '#fbc531']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View style={{
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
            }}>
              <View>
                <LessonCard lesson={item} onPress={handleSelectLesson} />
                {/* Animated progress bar for completed lessons */}
                {item.status === 'completed' && (
                  <Animated.View style={styles.progressBarContainer}>
                    <Animated.View style={styles.progressBar} />
                  </Animated.View>
                )}
                {downloaded[item.id] ? (
                  <Text style={styles.downloaded}>Downloaded</Text>
                ) : (
                  <Button title="Download for Offline" onPress={() => handleDownloadLesson(item)} />
                )}
              </View>
            </Animated.View>
          )}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  error: { color: 'red', textAlign: 'center', marginTop: 32 },
  downloaded: { color: 'green', textAlign: 'center', marginBottom: 8 },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    width: '100%',
    backgroundColor: '#fbc531',
    borderRadius: 4,
  },
}); 