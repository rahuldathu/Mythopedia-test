import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export async function sendPushTokenToBackend(token, userId) {
  // Send the token to your backend to associate with the user
  await fetch('http://localhost:4000/api/profile/push-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userId}` }, // Replace with real JWT
    body: JSON.stringify({ token }),
  });
}

export async function sendTestPushNotification(token, message) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: token,
      sound: 'default',
      title: 'Mythopedia',
      body: message,
      data: { message },
    }),
  });
}

// --- Local Notification Scheduling ---

/**
 * Schedule daily local notifications to remind the user to complete a lesson.
 * Schedules notifications for the next N days at a specified hour/minute.
 * @param {number} days Number of days to schedule (default: 7)
 * @param {number} hour Hour of day (24h) to send notification (default: 10)
 * @param {number} minute Minute of hour to send notification (default: 0)
 */
export async function scheduleDailyLessonReminders(days = 7, hour = 10, minute = 0) {
  // First, clear any existing scheduled notifications
  await clearScheduledLessonReminders();
  const identifiers = [];
  for (let i = 1; i <= days; i++) {
    const trigger = new Date();
    trigger.setDate(trigger.getDate() + i);
    trigger.setHours(hour);
    trigger.setMinutes(minute);
    trigger.setSeconds(0);
    trigger.setMilliseconds(0);
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Mythopedia',
        body: "Don't forget to complete a lesson today!",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'lesson_reminder' },
      },
      trigger,
    });
    identifiers.push(id);
  }
  // Optionally, store identifiers in AsyncStorage if you want to cancel later
  return identifiers;
}

/**
 * Cancel all scheduled lesson reminder notifications.
 */
export async function clearScheduledLessonReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * List all scheduled notifications (for debugging or management)
 */
export async function getScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
} 