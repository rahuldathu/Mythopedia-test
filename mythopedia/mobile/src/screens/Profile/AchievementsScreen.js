import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import achievements from '../../constants/achievements';

export default function AchievementsScreen() {
  const unlocked = useSelector(state => state.progress.achievements) || [];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <FlatList
        data={achievements}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isUnlocked = unlocked.includes(item.id);
          return (
            <View style={[styles.achievement, !isUnlocked && styles.locked]}>
              <Text style={[styles.icon, !isUnlocked && styles.lockedIcon]}>{item.icon}</Text>
              <View style={styles.info}>
                <Text style={[styles.name, !isUnlocked && styles.lockedText]}>{item.name}</Text>
                <Text style={[styles.desc, !isUnlocked && styles.lockedText]}>{item.description}</Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#2b1055' },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  locked: {
    backgroundColor: '#eee',
    opacity: 0.5,
  },
  icon: { fontSize: 36, marginRight: 18 },
  lockedIcon: { color: '#aaa' },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#2b1055' },
  desc: { fontSize: 14, color: '#555', marginTop: 2 },
  lockedText: { color: '#aaa' },
}); 