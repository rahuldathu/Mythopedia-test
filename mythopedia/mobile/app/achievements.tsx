import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNotification } from '../src/context/NotificationContext';

export default function AchievementsScreen() {
  const achievements = useSelector((state: any) => state.user.achievements || []);
  const { showNotification } = useNotification();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      {achievements.length === 0 ? (
        <Text>No achievements yet.</Text>
      ) : (
        achievements.map((ach: any, idx: number) => (
          <Text key={idx}>{ach.title}</Text>
        ))
      )}
      <Button title="Show Notification" onPress={() => showNotification('Achievements loaded!')} />
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