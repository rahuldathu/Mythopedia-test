import { API_BASE_URL } from './apiConfig';

export async function fetchCourses() {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    const data = await response.json();
    return data.courses;
  } catch (error) {
    throw error;
  }
} 