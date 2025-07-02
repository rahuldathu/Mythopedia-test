import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function CourseCard({ course, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(course)}>
      <View>
        <Text style={styles.title}>{course.name}</Text>
        <Text style={styles.type}>{course.mythology_type}</Text>
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
  title: { fontSize: 20, fontWeight: 'bold' },
  type: { fontSize: 14, color: '#888', marginTop: 4 },
}); 