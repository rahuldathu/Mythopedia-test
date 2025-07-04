import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CourseSelectionScreen from '../screens/Home/CourseSelectionScreen';
import LeaderboardScreen from '../screens/Leaderboard/LeaderboardScreen';
import AchievementsScreen from '../screens/Profile/AchievementsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={CourseSelectionScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
} 