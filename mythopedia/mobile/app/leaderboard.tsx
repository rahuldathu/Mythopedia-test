import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNotification } from '../src/context/NotificationContext';

export default function LeaderboardScreen() {
  const leaderboard = useSelector((state: any) => state.leaderboard?.entries || []);
  const { showNotification } = useNotification();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {leaderboard.length === 0 ? (
        <Text>No leaderboard data.</Text>
      ) : (
        leaderboard.map((entry: any, idx: number) => (
          <Text key={idx}>{entry.name}: {entry.score}</Text>
        ))
      )}
      <Button title="Show Notification" onPress={() => showNotification('Leaderboard loaded!')} />
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