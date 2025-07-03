import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Animated } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import AchievementCard from '../../components/AchievementCard';
import { logAchievementUnlock } from '../../services/analyticsService';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function AchievementsScreen() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    fetchAchievements();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Celebratory haptic feedback for new unlocks
    if (!celebrated && achievements.some(a => a.userachievements && a.userachievements.length > 0)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCelebrated(true);
    }
  }, [achievements, celebrated]);

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
      // Log analytics for unlocked achievements
      achievementsWithUser.forEach(a => {
        if (a.userachievements && a.userachievements.length > 0) {
          logAchievementUnlock(a.id, a.name);
        }
      });
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
    <LinearGradient
      colors={['#2b1055', '#7597de', '#fbc531']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <FlatList
          data={achievements}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View style={{
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
            }}>
              <AchievementCard achievement={item} />
            </Animated.View>
          )}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  error: { color: 'red', textAlign: 'center', marginTop: 32 },
}); 