import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Picker } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import LeaderboardEntry from '../../components/LeaderboardEntry';
import { fetchCourses } from '../../services/courseService';

export default function LeaderboardScreen({ route }) {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courseId, setCourseId] = useState(route?.params?.courseId || null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchAllCourses();
    fetchLeaderboard();
  }, [courseId]);

  const fetchAllCourses = async () => {
    try {
      const data = await fetchCourses();
      setCourses(data);
      if (!courseId && data.length > 0) setCourseId(data[0].id);
    } catch (e) {
      // ignore for now
    }
  };

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

  // After leaderboard state
  const userEntry = leaderboard.find(e => e.user_id === user.id);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    if (!userEntry && courseId) {
      // Fetch user's rank if not in top 20
      fetchUserRank();
    } else {
      setUserRank(null);
    }
  }, [leaderboard, courseId]);

  const fetchUserRank = async () => {
    try {
      // Try to fetch user's rank from backend
      const { data, error } = await supabase
        .rpc('get_user_rank', { course_id: courseId, user_id: user.id });
      if (!error && data && data.length > 0) {
        setUserRank(data[0]);
      } else {
        setUserRank(null);
      }
    } catch {
      setUserRank(null);
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
      <Picker
        selectedValue={courseId}
        onValueChange={value => setCourseId(value)}
        style={styles.picker}
      >
        {courses.map(course => (
          <Picker.Item key={course.id} label={course.name} value={course.id} />
        ))}
      </Picker>
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
      {/* Show user's own rank if not in top 20 */}
      {!userEntry && userRank && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ textAlign: 'center', color: '#888', marginBottom: 4 }}>Your Rank</Text>
          <LeaderboardEntry
            entry={userRank}
            rank={userRank.rank}
            isCurrentUser={true}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  error: { color: 'red', textAlign: 'center', marginTop: 32 },
  picker: { margin: 12, backgroundColor: '#fff', borderRadius: 8 },
}); 