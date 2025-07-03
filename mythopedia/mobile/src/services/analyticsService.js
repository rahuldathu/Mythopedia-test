import * as Analytics from 'expo-firebase-analytics';

export async function logLogin(method) {
  await Analytics.logEvent('login', { method });
}

export async function logCourseView(courseId, courseName) {
  await Analytics.logEvent('course_view', { courseId, courseName });
}

export async function logLessonView(lessonId, lessonTitle) {
  await Analytics.logEvent('lesson_view', { lessonId, lessonTitle });
}

export async function logLessonComplete(lessonId, score) {
  await Analytics.logEvent('lesson_complete', { lessonId, score });
}

export async function logXPChange(amount, reason) {
  await Analytics.logEvent('xp_change', { amount, reason });
}

export async function logAchievementUnlock(achievementId, name) {
  await Analytics.logEvent('achievement_unlock', { achievementId, name });
}

export async function logDownloadForOffline(courseId) {
  await Analytics.logEvent('download_for_offline', { courseId });
} 