import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import LeaderboardEntry from '../../components/LeaderboardEntry';

export default function LeaderboardScreen({ route }) {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courseId, setCourseId] = useState(route?.params?.courseId || null);

  useEffect(() => {
    fetchLeaderboard();
  }, [courseId]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      // If no courseId, fetch first course
      let cid = courseId;
      if (!cid) {
        const { data: courses } = await supabase.from('courses').select('id').limit(1);
        cid = courses?.[0]?.id;
        setCourseId(cid);
      }
      if (!cid) throw new Error('No course selected');
      // Fetch leaderboard for course
      const { data, error } = await supabase
        .from('leaderboards')
        .select('user_id, xp_total, users(username, avatar_url)')
        .eq('course_id', cid)
        .order('xp_total', { ascending: false })
        .limit(20);
      if (error) throw error;
      setLeaderboard(data);
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
        data={leaderboard}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item, index }) => (
          <LeaderboardEntry
            entry={item}
            rank={index + 1}
            isCurrentUser={item.user_id === user.id}
          />
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  error: { color: 'red', textAlign: 'center', marginTop: 32 },
}); 