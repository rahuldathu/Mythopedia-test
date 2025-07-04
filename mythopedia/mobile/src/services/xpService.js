import { setXP } from '../store/progressSlice';

// Awards XP and updates Redux. Optionally, add feedback/analytics here.
export function awardXP(amount, dispatch, currentXP) {
  const newXP = (currentXP || 0) + amount;
  dispatch(setXP(newXP));
  // TODO: Add feedback animation, analytics, backend sync if needed
  return newXP;
} 