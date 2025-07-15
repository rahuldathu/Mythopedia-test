import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConfirmEmailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm your email</Text>
      <Text style={styles.text}>
        We've sent you an email with a confirmation link. Please click the link to activate your account.
      </Text>
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
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
