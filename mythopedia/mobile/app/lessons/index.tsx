import React, { useMemo, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNotification } from '../../src/context/NotificationContext';
import { useLocalSearchParams, router } from 'expo-router';

export default function LessonListScreen() {
  const { courseId } = useLocalSearchParams();
  const lessons = useSelector((state: any) => {
    if (!courseId) return [];
    return state.lessons.byCourse?.[courseId] || [];
  });
  const { showNotification } = useNotification();

  const memoizedLessons = useMemo(() => lessons, [lessons]);
  const handleShowNotification = useCallback(() => showNotification('Lessons loaded!'), [showNotification]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lessons</Text>
      {memoizedLessons.length === 0 ? (
        <Text>No lessons available.</Text>
      ) : (
        memoizedLessons.map((lesson: any, idx: number) => (
          <TouchableOpacity
            key={idx}
            style={styles.lessonButton}
            onPress={() => router.push(`/lessons/${lesson.id}`)}
          >
            <Text style={styles.lessonText}>{lesson.title}</Text>
          </TouchableOpacity>
        ))
      )}
      <Button title="Show Notification" onPress={handleShowNotification} />
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
  lessonButton: {
    backgroundColor: '#eee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  lessonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 