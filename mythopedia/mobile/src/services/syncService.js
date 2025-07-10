import { getUnsyncedUserProgress, markUserProgressAsSynced } from '../database/wmUtils';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/supabaseClient';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function syncUserProgressToBackend(userId) {
  const unsynced = await getUnsyncedUserProgress();
  if (!unsynced.length) return;

  // Prepare payload for Supabase
  const payload = unsynced.map(p => ({
    id: p.id,
    user_id: p.user_id,
    lesson_id: p.lesson_id,
    status: p.status,
    updated_at: p.updated_at,
  }));

  // Upsert to Supabase
  const { error } = await supabase
    .from('progress')
    .upsert(payload, { onConflict: ['id'] }); // Adjust onConflict as per your schema

  if (!error) {
    await markUserProgressAsSynced(unsynced.map(p => p.id));
  } else {
    // Optionally handle error (e.g., log or retry)
    console.error('Supabase sync error:', error);
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