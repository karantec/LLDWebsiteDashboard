import axios from 'axios';

const API = axios.create({
  baseURL: 'https://lldwebsite.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Course ─────────────────────────────────────────────────────
export const getAllCourses = () => API.get('/course/all').then((r) => r.data);
export const getCourseById = (id) => API.get(`/course/${id}`).then((r) => r.data);
export const createCourse = (data) => API.post('/course/create', data).then((r) => r.data);
export const updateCourse = (id, data) => API.put(`/course/update/${id}`, data).then((r) => r.data);
export const deleteCourse = (id) => API.delete(`/course/delete/${id}`).then((r) => r.data);

// ── Session ────────────────────────────────────────────────────
export const addSession = (courseId, data) =>
  API.post(`/course/${courseId}/session/add`, data).then((r) => r.data);
export const updateSession = (courseId, sessionId, data) =>
  API.put(`/course/${courseId}/session/${sessionId}/update`, data).then((r) => r.data);
export const deleteSession = (courseId, sessionId) =>
  API.delete(`/course/${courseId}/session/${sessionId}/delete`).then((r) => r.data);
