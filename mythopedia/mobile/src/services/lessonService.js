import { API_BASE_URL } from './apiConfig';

export async function fetchLessons(courseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons`);
    if (!response.ok) throw new Error('Failed to fetch lessons');
    const data = await response.json();
    return data.lessons;
  } catch (error) {
    throw error;
  }
} 