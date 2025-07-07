import { setXP } from '../store/progressSlice';
import { logXPChange } from './analyticsService';
import { API_BASE_URL } from './apiConfig';
import XPToast from '../components/XPToast';
import * as Haptics from 'expo-haptics';

// Awards XP and updates Redux. Optionally, add feedback/analytics here.
export async function awardXP(amount, dispatch, currentXP, userId) {
  const newXP = (currentXP || 0) + amount;
  dispatch(setXP(newXP));

  // Feedback animation (haptics)
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  // Analytics
  logXPChange(amount, 'award_xp');

  // Backend sync
  if (userId) {
    try {
      await fetch(`${API_BASE_URL}/xp/award`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });
    } catch (e) {
      // Optionally handle error
      console.warn('Failed to sync XP to backend:', e.message);
    }
  }

  return newXP;
} 