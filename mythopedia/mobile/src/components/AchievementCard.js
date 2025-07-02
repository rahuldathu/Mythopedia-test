import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AchievementCard({ achievement }) {
  const unlocked = achievement.userachievements && achievement.userachievements.length > 0;
  return (
    <View style={[styles.card, unlocked && styles.unlocked]}>
      <Text style={styles.name}>{achievement.name}</Text>
      <Text style={styles.condition}>{achievement.condition_type}: {achievement.value}</Text>
      {unlocked ? (
        <Text style={styles.unlockedText}>Unlocked {achievement.userachievements[0].unlocked_at?.slice(0, 10)}</Text>
      ) : (
        <Text style={styles.lockedText}>Locked</Text>
      )}
    </View>
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
    alignItems: 'center',
  },
  unlocked: {
    backgroundColor: '#e0ffe0',
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  condition: { fontSize: 14, color: '#888', marginTop: 4 },
  unlockedText: { color: 'green', marginTop: 8 },
  lockedText: { color: '#aaa', marginTop: 8 },
}); 