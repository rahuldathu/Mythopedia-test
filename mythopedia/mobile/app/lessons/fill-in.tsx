import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNotification } from '../../src/context/NotificationContext';
import { setXP } from '../../src/store/progressSlice';

export default function FillInLessonScreen() {
  const lesson = useSelector((state: any) => state.lessons.currentFillIn || null);
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Fill In Lesson</Text>
        <Text>No fill-in loaded.</Text>
      </View>
    );
  }

  const handleComplete = () => {
    dispatch(setXP(lesson.xp || 10));
    showNotification('Fill-in completed!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fill In Lesson</Text>
      <Text>{lesson.content ?? 'No content available.'}</Text>
      <Button title="Complete Fill-In" onPress={handleComplete} />
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
