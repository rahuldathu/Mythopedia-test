import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function LessonCard({ lesson, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(lesson)}>
      <View>
        <Text style={styles.title}>Lesson: {lesson.type}</Text>
        <Text style={styles.status}>Status: {lesson.status || 'not_started'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  status: { fontSize: 14, color: '#888', marginTop: 4 },
}); 