import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { logLessonComplete, logXPChange } from '../../services/analyticsService';

export default function LessonResultScreen({ route, navigation }) {
  const { xp, lessonId } = route.params;
  useEffect(() => {
    if (lessonId) logLessonComplete(lessonId, xp);
    if (xp) logXPChange(xp, 'lesson_complete');
  }, [lessonId, xp]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lesson Complete!</Text>
      <Text style={styles.xp}>+{xp} XP</Text>
      <Button title="Back to Lessons" onPress={() => navigation.navigate('Lessons')} />
      {/* TODO: Add continue to next lesson */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  xp: { fontSize: 24, color: 'green', marginBottom: 32 },
}); 