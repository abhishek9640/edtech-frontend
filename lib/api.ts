import axiosInstance from './axios';

export const api = {
  // Auth
  auth: {
    register: (data: any) => axiosInstance.post('/auth/register', data),
    login: (data: any) => axiosInstance.post('/auth/login', data),
    getMe: () => axiosInstance.get('/auth/me'),
  },

  // Courses
  courses: {
    getAll: (params?: any) => axiosInstance.get('/courses', { params }),
    getOne: (id: string) => axiosInstance.get(`/courses/${id}`),
    create: (data: any) => axiosInstance.post('/courses', data),
    update: (id: string, data: any) => axiosInstance.put(`/courses/${id}`, data),
    delete: (id: string) => axiosInstance.delete(`/courses/${id}`),
    addReview: (id: string, data: any) => axiosInstance.post(`/courses/${id}/reviews`, data),
    togglePublish: (id: string) => axiosInstance.patch(`/courses/${id}/publish`),
    getInstructorCourses: () => axiosInstance.get('/courses/instructor/my-courses'),
  },

  // Enrollments
  enrollments: {
    enroll: (courseId: string) => axiosInstance.post(`/enrollments/${courseId}/enroll`),
    getMyEnrollments: () => axiosInstance.get('/enrollments/my-enrollments'),
    getEnrollment: (courseId: string) => axiosInstance.get(`/enrollments/${courseId}`),
    completeLesson: (courseId: string, lessonId: string) =>
      axiosInstance.post(`/enrollments/${courseId}/lessons/${lessonId}/complete`),
    unenroll: (courseId: string) => axiosInstance.delete(`/enrollments/${courseId}/unenroll`),
  },

  // Lessons
  lessons: {
    getCourseLessons: (courseId: string) => axiosInstance.get(`/lessons/courses/${courseId}/lessons`),
    getOne: (id: string) => axiosInstance.get(`/lessons/${id}`),
    create: (courseId: string, data: any) => axiosInstance.post(`/lessons/courses/${courseId}/lessons`, data),
    update: (id: string, data: any) => axiosInstance.put(`/lessons/${id}`, data),
    delete: (id: string) => axiosInstance.delete(`/lessons/${id}`),
  },

  // Users
  users: {
    getProfile: (id: string) => axiosInstance.get(`/users/${id}`),
    updateProfile: (data: any) => axiosInstance.put('/users/profile', data),
  },
};
