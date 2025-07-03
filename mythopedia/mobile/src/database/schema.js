import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'courses',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'mythology_type', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'lessons',
      columns: [
        { name: 'course_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'content', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'user_progress',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'lesson_id', type: 'string', isIndexed: true },
        { name: 'status', type: 'string' },
        { name: 'score', type: 'number', isOptional: true },
        { name: 'updated_at', type: 'number' },
        { name: 'synced', type: 'boolean', isOptional: true },
      ],
    }),
  ],
}); 