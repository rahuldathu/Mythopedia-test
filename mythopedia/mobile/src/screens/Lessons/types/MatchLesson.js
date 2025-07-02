import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CustomButton from '../../../components/CustomButton';

export default function MatchLesson({ lesson, onComplete }) {
  const { pairs } = lesson.content; // [{ left, right }]
  const [matches, setMatches] = useState([]);
  const animRef = useRef(null);
  // For demo: just show pairs and a complete button
  const handleComplete = () => {
    if (animRef.current) {
      animRef.current.bounceIn(800);
    }
    setTimeout(() => onComplete(true), 1000);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match the Pairs</Text>
      {pairs.map((pair, idx) => (
        <Text key={idx} style={styles.pairText}>{pair.left} - {pair.right}</Text>
      ))}
      <CustomButton
        title="Complete"
        onPress={handleComplete}
        style={styles.submitBtn}
      />
      <Animatable.Text ref={animRef} style={styles.correct}>✓ Correct!</Animatable.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 24, paddingHorizontal: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  pairText: { fontSize: 16, marginVertical: 4 },
  submitBtn: { marginTop: 12, width: 180 },
  correct: { color: 'green', fontSize: 22, fontWeight: 'bold', marginTop: 20, backgroundColor: '#e6ffe6', padding: 10, borderRadius: 12 },
}); 