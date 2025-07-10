// Analytics service stub. Previously used expo-firebase-analytics, now removed.
// You can implement analytics with Amplitude, Firebase JS SDK, or another solution here.

export async function logEvent(eventName, params) {
  // Example: Replace with your analytics provider
  // e.g., Amplitude.logEvent(eventName, params);
  // For now, just log to console
  console.log('Analytics event:', eventName, params);
}

export async function logLessonView(lessonId) {
  // Example: Replace with your analytics provider
  console.log('Lesson viewed:', lessonId);
}

export async function logDownloadForOffline(courseId) {
  // Example: Replace with your analytics provider
  console.log('Course downloaded for offline:', courseId);
} 