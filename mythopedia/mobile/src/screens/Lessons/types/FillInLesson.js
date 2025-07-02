import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CustomButton from '../../../components/CustomButton';

export default function FillInLesson({ lesson, onComplete }) {
  const { prompt, answer } = lesson.content;
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const animRef = useRef(null);

  const isCorrect = input.trim().toLowerCase() === answer.trim().toLowerCase();

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onComplete(isCorrect), 1000);
    if (animRef.current) {
      animRef.current[isCorrect ? 'bounceIn' : 'shake'](800);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{prompt}</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        editable={!submitted}
        placeholder="Type your answer..."
        placeholderTextColor="#aaa"
      />
      <CustomButton
        title="Submit"
        onPress={handleSubmit}
        disabled={submitted}
        style={styles.submitBtn}
      />
      {submitted && (
        <Animatable.Text
          ref={animRef}
          style={isCorrect ? styles.correct : styles.incorrect}
        >
          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
        </Animatable.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 24, paddingHorizontal: 16 },
  prompt: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, width: 240, marginBottom: 16, fontSize: 16, backgroundColor: '#f9f9f9' },
  submitBtn: { width: 180 },
  correct: { color: 'green', fontSize: 22, fontWeight: 'bold', marginTop: 20, backgroundColor: '#e6ffe6', padding: 10, borderRadius: 12 },
  incorrect: { color: 'red', fontSize: 22, fontWeight: 'bold', marginTop: 20, backgroundColor: '#ffe6e6', padding: 10, borderRadius: 12 },
}); 