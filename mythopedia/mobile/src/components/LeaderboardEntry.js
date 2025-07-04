import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import achievementsList from '../constants/achievements';

const trophyIcons = ['🥇', '🥈', '🥉'];

export default function LeaderboardEntry({ entry, rank, isCurrentUser }) {
  // Find a major achievement badge (e.g., course_conqueror, quiz_whiz, mythopedia_pro)
  const majorBadges = ['course_conqueror', 'quiz_whiz', 'mythopedia_pro'];
  const badgeId = (entry.achievements || []).find(a => majorBadges.includes(a));
  const badge = achievementsList.find(a => a.id === badgeId);

  // Animation
  const scale = useRef(new Animated.Value(0.95)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.row,
      isCurrentUser && styles.currentUser,
      { transform: [{ scale }], opacity },
    ]}>
      <Text style={styles.rank}>
        {rank <= 3 ? trophyIcons[rank - 1] : rank}
      </Text>
      <Image source={{ uri: entry.users?.avatar_url || undefined }} style={styles.avatar} />
      <Text style={styles.username}>{entry.users?.username || 'User'}</Text>
      {badge && <Text style={styles.badge}>{badge.icon}</Text>}
      <Text style={styles.xp}>{entry.xp_total} XP</Text>
    </Animated.View>
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
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  currentUser: {
    backgroundColor: '#e0ffe0',
    borderColor: '#2b1055',
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  rank: { width: 38, fontWeight: 'bold', fontSize: 22, textAlign: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  username: { flex: 1, fontSize: 16 },
  badge: { fontSize: 22, marginHorizontal: 6 },
  xp: { fontWeight: 'bold', fontSize: 16 },
}); 