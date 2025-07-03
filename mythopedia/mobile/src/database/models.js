import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, writer } from '@nozbe/watermelondb/decorators';

export class Course extends Model {
  static table = 'courses';
  @field('name') name;
  @field('mythology_type') mythologyType;
  @field('description') description;
}

export class Lesson extends Model {
  static table = 'lessons';
  @field('course_id') courseId;
  @field('title') title;
  @field('type') type;
  @field('content') content;
}

export class UserProgress extends Model {
  static table = 'user_progress';
  @field('user_id') userId;
  @field('lesson_id') lessonId;
  @field('status') status;
  @field('score') score;
  @field('updated_at') updatedAt;
  @field('synced') synced;
} 