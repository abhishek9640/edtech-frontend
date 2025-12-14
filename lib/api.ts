import axiosInstance from './axios';
import type {
    RegisterPayload,
    LoginPayload,
    AuthResponse,
    User,
    Course,
    CourseListParams,
    CourseListResponse,
    CourseDetailResponse,
    CreateCoursePayload,
    ReviewPayload,
    Lesson,
    CreateLessonPayload,
    LessonListResponse,
    EnrollmentListResponse,
    EnrollmentResponse,
    ApiResponse,
} from '@/types/api';

/**
 * API client with typed methods for all endpoints
 */
export const api = {
    // ============ Auth ============
    auth: {
        /** Register a new user */
        register: (data: RegisterPayload) =>
            axiosInstance.post<AuthResponse>('/auth/register', data),

        /** Login with email and password */
        login: (data: LoginPayload) =>
            axiosInstance.post<AuthResponse>('/auth/login', data),

        /** Get current authenticated user */
        getMe: () =>
            axiosInstance.get<ApiResponse<{ user: User }>>('/auth/me'),
    },

    // ============ Courses ============
    courses: {
        /** Get all courses with optional filters */
        getAll: (params?: CourseListParams) =>
            axiosInstance.get<CourseListResponse>('/courses', { params }),

        /** Get a single course by ID with its lessons */
        getOne: (id: string) =>
            axiosInstance.get<CourseDetailResponse>(`/courses/${id}`),

        /** Create a new course (instructor only) */
        create: (data: CreateCoursePayload) =>
            axiosInstance.post<ApiResponse<{ course: Course }>>('/courses', data),

        /** Update an existing course */
        update: (id: string, data: Partial<CreateCoursePayload>) =>
            axiosInstance.put<ApiResponse<{ course: Course }>>(`/courses/${id}`, data),

        /** Delete a course */
        delete: (id: string) =>
            axiosInstance.delete<ApiResponse<null>>(`/courses/${id}`),

        /** Add a review to a course */
        addReview: (id: string, data: ReviewPayload) =>
            axiosInstance.post<ApiResponse<{ review: Course['reviews'] }>>(`/courses/${id}/reviews`, data),

        /** Toggle course publish status */
        togglePublish: (id: string) =>
            axiosInstance.patch<ApiResponse<{ course: Course }>>(`/courses/${id}/publish`),

        /** Get instructor's own courses */
        getInstructorCourses: () =>
            axiosInstance.get<CourseListResponse>('/courses/instructor/my-courses'),
    },

    // ============ Enrollments ============
    enrollments: {
        /** Enroll in a course */
        enroll: (courseId: string) =>
            axiosInstance.post<EnrollmentResponse>(`/enrollments/${courseId}/enroll`),

        /** Get current user's enrollments */
        getMyEnrollments: () =>
            axiosInstance.get<EnrollmentListResponse>('/enrollments/my-enrollments'),

        /** Get enrollment details for a specific course */
        getEnrollment: (courseId: string) =>
            axiosInstance.get<EnrollmentResponse>(`/enrollments/${courseId}`),

        /** Mark a lesson as complete */
        completeLesson: (courseId: string, lessonId: string) =>
            axiosInstance.post<EnrollmentResponse>(
                `/enrollments/${courseId}/lessons/${lessonId}/complete`
            ),

        /** Unenroll from a course */
        unenroll: (courseId: string) =>
            axiosInstance.delete<ApiResponse<null>>(`/enrollments/${courseId}/unenroll`),
    },

    // ============ Lessons ============
    lessons: {
        /** Get all lessons for a course */
        getCourseLessons: (courseId: string) =>
            axiosInstance.get<LessonListResponse>(`/lessons/courses/${courseId}/lessons`),

        /** Get a single lesson by ID */
        getOne: (id: string) =>
            axiosInstance.get<ApiResponse<{ lesson: Lesson }>>(`/lessons/${id}`),

        /** Create a new lesson for a course */
        create: (courseId: string, data: CreateLessonPayload) =>
            axiosInstance.post<ApiResponse<{ lesson: Lesson }>>(
                `/lessons/courses/${courseId}/lessons`,
                data
            ),

        /** Update an existing lesson */
        update: (id: string, data: Partial<CreateLessonPayload>) =>
            axiosInstance.put<ApiResponse<{ lesson: Lesson }>>(`/lessons/${id}`, data),

        /** Delete a lesson */
        delete: (id: string) =>
            axiosInstance.delete<ApiResponse<null>>(`/lessons/${id}`),
    },

    // ============ Users ============
    users: {
        /** Get a user's public profile */
        getProfile: (id: string) =>
            axiosInstance.get<ApiResponse<{ user: User }>>(`/users/${id}`),

        /** Update current user's profile */
        updateProfile: (data: Partial<Pick<User, 'name' | 'avatar'>>) =>
            axiosInstance.put<ApiResponse<{ user: User }>>('/users/profile', data),
    },
};
