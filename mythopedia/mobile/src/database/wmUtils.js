import database from './index';

export async function saveCourse(course) {
  await database.write(async () => {
    await database.get('courses').create((c) => {
      c._raw.id = course.id;
      c.name = course.name;
      c.mythologyType = course.mythology_type;
      c.description = course.description;
    });
  });
}

export async function saveLessons(lessons) {
  await database.write(async () => {
    for (const lesson of lessons) {
      await database.get('lessons').create((l) => {
        l._raw.id = lesson.id;
        l.courseId = lesson.course_id;
        l.title = lesson.title;
        l.type = lesson.type;
        l.content = lesson.content;
      });
    }
  });
}

export async function getOfflineCourses() {
  return await database.get('courses').query().fetch();
}

export async function getOfflineLessons(courseId) {
  return await database.get('lessons').query().where('course_id', courseId).fetch();
}

export async function getUnsyncedUserProgress() {
  return await database.get('user_progress').query().where('synced', false).fetch();
}

export async function markUserProgressAsSynced(ids) {
  await database.write(async () => {
    for (const id of ids) {
      const record = await database.get('user_progress').find(id);
      await record.update((r) => {
        r.synced = true;
      });
    }
  });
} 