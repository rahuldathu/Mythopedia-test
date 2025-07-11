import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useLocalSearchParams, router } from 'expo-router';
import { useNotification } from '../../src/context/NotificationContext';
import { setXP } from '../../src/store/progressSlice';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams();
  const lesson = useSelector((state: any) => state.lessons.byId?.[lessonId] || null);
  const progress = useSelector((state: any) => state.progress.byLesson?.[lessonId] || null);
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lesson not found</Text>
      </View>
    );
  }

  const handleComplete = () => {
    dispatch(setXP(lesson.xp || 10));
    showNotification('Lesson completed!');
    router.push('/lessons');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text>{lesson.content}</Text>
      <Text>Status: {progress ? progress.status : 'Not started'}</Text>
      <Button title="Mark as Complete" onPress={handleComplete} />
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
}); 