import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function LeaderboardEntry({ entry, rank, isCurrentUser }) {
  return (
    <View style={[styles.row, isCurrentUser && styles.currentUser]}>
      <Text style={styles.rank}>{rank}</Text>
      <Image source={{ uri: entry.users?.avatar_url || undefined }} style={styles.avatar} />
      <Text style={styles.username}>{entry.users?.username || 'User'}</Text>
      <Text style={styles.xp}>{entry.xp_total} XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  currentUser: {
    backgroundColor: '#e0ffe0',
  },
  rank: { width: 32, fontWeight: 'bold', fontSize: 18 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  username: { flex: 1, fontSize: 16 },
  xp: { fontWeight: 'bold', fontSize: 16 },
}); 