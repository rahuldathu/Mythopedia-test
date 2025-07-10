import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Button, Share, ToastAndroid, Platform } from 'react-native';
import CourseCard from '../../components/CourseCard';
import { fetchCourses } from '../../services/courseService';
import { useDispatch, useSelector } from 'react-redux';
import { setDownloadedCourses } from '../../store/offlineSlice';
import { fetchLessons } from '../../services/lessonService';
import NetInfo from '@react-native-community/netinfo';
import { logCourseView, logDownloadForOffline, logShare } from '../../services/analyticsService';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import XPProgressBar from '../../components/XPProgressBar';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { saveCourse, saveLessons, getOfflineCourses } from '../../database/wmUtils';

export default function CourseSelectionScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const downloadedCourses = useSelector(state => state.offline.downloadedCourses);
  const [isOffline, setIsOffline] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const xp = useSelector(state => state.progress.xp);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    loadCourses();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      courses.forEach(course => logCourseView(course.id, course.name));
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [courses]);

  const loadCourses = async () => {
    setLoading(true);
    setError('');
    try {
      if (isOffline) {
        const offlineCourses = await getOfflineCourses();
        setCourses(offlineCourses);
      } else {
        const data = await fetchCourses();
        setCourses(data);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (course) => {
    logCourseView(course.id, course.name);
    navigation.navigate('LessonList', { courseId: course.id });
  };

  const handleDownloadCourse = async (course) => {
    try {
      const lessons = await fetchLessons(course.id);
      await saveCourse(course);
      await saveLessons(lessons);
      const offlineCourses = await getOfflineCourses();
      dispatch(setDownloadedCourses(offlineCourses.map(c => c.id)));
      await logDownloadForOffline(course.id);
      Alert.alert('Downloaded', 'Course and lessons cached for offline use.');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handleShareCourse = async (course) => {
    const url = Linking.createURL(`/course/${course.id}`);
    await Clipboard.setStringAsync(url);
    await logShare('share', course.id, 'course');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Link copied to clipboard!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Link copied to clipboard!');
    }
    await Share.share({ message: `Check out this course on Mythopedia! ${url}` });
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
        <XPProgressBar xp={xp} xpToNextLevel={100} level={1} />
        <Text style={styles.title}>Select a Mythology Course</Text>
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View style={{
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
            }}>
              <View>
                <CourseCard course={item} onPress={handleSelectCourse} />
                {downloadedCourses.includes(item.id) ? (
                  <Text style={{ color: 'green', textAlign: 'center' }}>Downloaded</Text>
                ) : (
                  <Button title="Download for Offline" onPress={() => handleDownloadCourse(item)} />
                )}
                <Button title="Share" onPress={() => handleShareCourse(item)} />
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', marginTop: 24 },
  error: { color: 'red', textAlign: 'center', marginTop: 32 },
}); 