import { getUnsyncedUserProgress, markUserProgressAsSynced, saveCourse, saveLessons } from '../database/wmUtils';
import { API_BASE_URL } from './apiConfig';
import { getOfflineCourses } from '../database/wmUtils';

export async function syncUserProgressToBackend(userId) {
  const unsynced = await getUnsyncedUserProgress();
  if (!unsynced.length) return;
  const payload = unsynced.map(p => ({
    id: p.id,
    user_id: p.userId,
    lesson_id: p.lessonId,
    status: p.status,
    score: p.score,
    updated_at: p.updatedAt,
  }));
  const res = await fetch(`${API_BASE_URL}/userprogress/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, progress: payload }),
  });
  if (res.ok) {
    await markUserProgressAsSynced(unsynced.map(p => p.id));
  }
}

export async function syncCoursesAndLessonsFromBackend() {
  const offlineCourses = await getOfflineCourses();
  for (const course of offlineCourses) {
    // Pull latest lessons for each downloaded course
    const res = await fetch(`${API_BASE_URL}/courses/${course.id}/lessons`);
    if (res.ok) {
      const data = await res.json();
      await saveLessons(data.lessons);
    }
    // Optionally, pull course updates
    const cres = await fetch(`${API_BASE_URL}/courses`);
    if (cres.ok) {
      const cdata = await cres.json();
      const updated = cdata.courses.find(c => c.id === course.id);
      if (updated) await saveCourse(updated);
    }
  }
} 