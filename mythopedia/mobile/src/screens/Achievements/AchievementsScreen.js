import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import AchievementCard from '../../components/AchievementCard';

export default function AchievementsScreen() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*, userachievements!left(user_id, unlocked_at)')
        .order('value');
      if (error) throw error;
      // Filter userachievements for this user
      const achievementsWithUser = data.map(a => ({
        ...a,
        userachievements: (a.userachievements || []).filter(ua => ua.user_id === user.id),
      }));
      setAchievements(achievementsWithUser);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AchievementCard achievement={item} />}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  error: { color: 'red', textAlign: 'center', marginTop: 32 },
}); 