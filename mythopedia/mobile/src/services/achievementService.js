import achievements from '../constants/achievements';
import { setAchievements } from '../store/progressSlice';

// Checks and unlocks achievements based on current progress
export function checkAndUnlockAchievements(progress, unlockedAchievements, dispatch) {
  const unlocked = unlockedAchievements || [];
  const newlyUnlocked = achievements.filter(a => a.check(progress) && !unlocked.includes(a.id));
  if (newlyUnlocked.length > 0) {
    const updated = [...unlocked, ...newlyUnlocked.map(a => a.id)];
    dispatch(setAchievements(updated));
  }
  return newlyUnlocked;
} 