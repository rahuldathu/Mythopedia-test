import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ title, onPress, selected, disabled, style, textStyle }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        selected && styles.selected,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.text, selected && styles.selectedText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4F8EF7',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  selected: {
    backgroundColor: '#2E5AAC',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowOpacity: 0.3,
  },
  selectedText: {
    color: '#FFD700',
  },
  disabled: {
    backgroundColor: '#B0C4DE',
    shadowOpacity: 0,
  },
}); 