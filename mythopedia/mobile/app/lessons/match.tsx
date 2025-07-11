import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNotification } from '../../src/context/NotificationContext';
import { setXP } from '../../src/store/progressSlice';

export default function MatchLessonScreen() {
  const lesson = useSelector((state: any) => state.lessons.currentMatch || null);
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  const handleComplete = () => {
    dispatch(setXP(lesson?.xp || 10));
    showNotification('Match completed!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match Lesson</Text>
      <Text>{lesson ? lesson.content : 'No match loaded.'}</Text>
      <Button title="Complete Match" onPress={handleComplete} />
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