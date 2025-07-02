import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import LessonScreen from '../screens/Lessons/LessonScreen';
import LessonResultScreen from '../screens/Lessons/LessonResultScreen';
// import AvatarUploadScreen, etc.

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
      <Stack.Screen name="LessonResult" component={LessonResultScreen} />
      {/* Add deep navigation screens here */}
    </Stack.Navigator>
  );
} 