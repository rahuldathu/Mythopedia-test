import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { logLessonComplete, logXPChange } from '../../services/analyticsService';
import { useDispatch, useSelector } from 'react-redux';
import { awardXP } from '../../services/xpService';
import XPToast from '../../components/XPToast';
import * as Haptics from 'expo-haptics';
import { checkAndUnlockAchievements } from '../../services/achievementService';
import { useNotification } from '../../context/NotificationContext';

export default function LessonResultScreen({ route, navigation }) {
  const { xp, lessonId } = route.params;
  const dispatch = useDispatch();
  const currentXP = useSelector(state => state.progress.xp);
  const unlockedAchievements = useSelector(state => state.progress.achievements);
  const [showToast, setShowToast] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievement, setAchievement] = useState(null);
  const { showNotification } = useNotification();
  useEffect(() => {
    if (lessonId) logLessonComplete(lessonId, xp);
    if (xp) logXPChange(xp, 'lesson_complete');
    if (xp) {
      awardXP(xp, dispatch, currentXP);
      setShowToast(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Check and unlock achievements
      const newlyUnlocked = checkAndUnlockAchievements(
        { ...useSelector(state => state.progress) },
        unlockedAchievements,
        dispatch
      );
      if (newlyUnlocked.length > 0) {
        setAchievement(newlyUnlocked[0]);
        setShowAchievement(true);
        showNotification(`${newlyUnlocked[0].name} Unlocked!`, 'success');
      }
    }
  }, [lessonId, xp]);
  return (
    <View style={styles.container}>
      <XPToast amount={xp} visible={showToast} onHide={() => setShowToast(false)} />
      {showAchievement && achievement && (
        <XPToast amount={achievement.name + ' Unlocked!'} visible={showAchievement} onHide={() => setShowAchievement(false)} />
      )}
      <Text style={styles.title}>Lesson Complete!</Text>
      <Text style={styles.xp}>+{xp} XP</Text>
      <Button title="Back to Lessons" onPress={() => navigation.navigate('Lessons')} />
      <Button title="Continue to Next Lesson" onPress={() => navigation.navigate('Lesson', { lessonId: lessonId + 1 })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  xp: { fontSize: 24, color: 'green', marginBottom: 32 },
}); 