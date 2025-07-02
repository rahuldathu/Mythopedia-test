import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CustomButton from '../../../components/CustomButton';

export default function ImageMatchLesson({ lesson, onComplete }) {
  const { imageUrl, options, answer } = lesson.content;
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const animRef = useRef(null);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onComplete(selected === answer), 1000);
    if (animRef.current) {
      animRef.current[selected === answer ? 'bounceIn' : 'shake'](800);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      {options.map((opt, idx) => (
        <CustomButton
          key={idx}
          title={opt}
          selected={selected === idx}
          onPress={() => setSelected(idx)}
          disabled={submitted}
          style={styles.optionBtn}
        />
      ))}
      <CustomButton
        title="Submit"
        onPress={handleSubmit}
        disabled={selected === null || submitted}
        style={styles.submitBtn}
      />
      {submitted && (
        <Animatable.Text
          ref={animRef}
          style={selected === answer ? styles.correct : styles.incorrect}
        >
          {selected === answer ? '✓ Correct!' : '✗ Incorrect'}
        </Animatable.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 24, paddingHorizontal: 16 },
  image: { width: 200, height: 200, marginBottom: 20, borderRadius: 16, borderWidth: 1, borderColor: '#eee' },
  optionBtn: { width: '100%', maxWidth: 340 },
  submitBtn: { marginTop: 12, width: 180 },
  correct: { color: 'green', fontSize: 22, fontWeight: 'bold', marginTop: 20, backgroundColor: '#e6ffe6', padding: 10, borderRadius: 12 },
  incorrect: { color: 'red', fontSize: 22, fontWeight: 'bold', marginTop: 20, backgroundColor: '#ffe6e6', padding: 10, borderRadius: 12 },
}); 