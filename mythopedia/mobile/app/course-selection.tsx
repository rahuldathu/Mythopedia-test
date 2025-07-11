import React, { useMemo, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNotification } from '../src/context/NotificationContext';
import { router } from 'expo-router';

export default function CourseSelectionScreen() {
  const courses = useSelector((state: any) => state.courses.list || []);
  const { showNotification } = useNotification();

  const memoizedCourses = useMemo(() => courses, [courses]);
  const handleShowNotification = useCallback(() => showNotification('Courses loaded!'), [showNotification]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Course Selection</Text>
      {memoizedCourses.length === 0 ? (
        <Text>No courses available.</Text>
      ) : (
        memoizedCourses.map((course: any, idx: number) => (
          <TouchableOpacity
            key={idx}
            style={styles.courseButton}
            onPress={() => router.push(`/lessons?courseId=${course.id}`)}
          >
            <Text style={styles.courseText}>{course.title}</Text>
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
  courseButton: {
    backgroundColor: '#eee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  courseText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 