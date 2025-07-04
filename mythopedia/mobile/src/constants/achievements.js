const achievements = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '👣',
    check: (progress) => Object.values(progress.lessonProgress || {}).length >= 1,
  },
  {
    id: 'quiz_whiz',
    name: 'Quiz Whiz',
    description: 'Get a perfect score on any quiz',
    icon: '🧠',
    check: (progress) => Object.values(progress.lessonProgress || {}).some(lp => lp.type === 'quiz' && lp.score === 100),
  },
  {
    id: 'streak_starter',
    name: 'Streak Starter',
    description: 'Complete lessons 3 days in a row',
    icon: '🔥',
    check: (progress) => progress.streak >= 3,
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Complete lessons 7 days in a row',
    icon: '💪',
    check: (progress) => progress.streak >= 7,
  },
  {
    id: 'course_conqueror',
    name: 'Course Conqueror',
    description: 'Complete your first course',
    icon: '🏆',
    check: (progress) => (progress.completedCourses || []).length >= 1,
  },
  {
    id: 'xp_collector',
    name: 'XP Collector',
    description: 'Earn 500 total XP',
    icon: '💎',
    check: (progress) => progress.xp >= 500,
  },
  {
    id: 'mythopedia_pro',
    name: 'Mythopedia Pro',
    description: 'Complete 50 lessons',
    icon: '🌟',
    check: (progress) => Object.values(progress.lessonProgress || {}).length >= 50,
  },
];

export default achievements; 