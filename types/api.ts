/**
 * API Types and Interfaces
 * Centralized TypeScript definitions for all API calls
 */

// ============ Auth Types ============

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'instructor';
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
        accessToken: string;
        refreshToken?: string;
    };
    message?: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'instructor' | 'admin';
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

// ============ Course Types ============

export interface Instructor {
    _id: string;
    name: string;
    email?: string;
    avatar?: string;
}

export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    thumbnail: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    rating: number;
    enrollmentCount: number;
    duration: number;
    instructor: Instructor;
    tags?: string[];
    reviews?: Review[];
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CourseListParams {
    category?: string;
    level?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
}

export interface CourseListResponse {
    success: boolean;
    data: {
        courses: Course[];
        pagination?: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export interface CourseDetailResponse {
    success: boolean;
    data: {
        course: Course;
        lessons: Lesson[];
    };
}

export interface CreateCoursePayload {
    title: string;
    description: string;
    category: string;
    price: number;
    duration: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    thumbnail?: string;
    tags?: string[];
}

export interface ReviewPayload {
    rating: number;
    comment: string;
}

// ============ Lesson Types ============

export interface Lesson {
    _id: string;
    title: string;
    content: string;
    videoUrl?: string;
    duration: number;
    order: number;
    course: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLessonPayload {
    title: string;
    content: string;
    videoUrl?: string;
    duration: number;
    order?: number;
}

export interface LessonListResponse {
    success: boolean;
    data: {
        lessons: Lesson[];
    };
}

// ============ Enrollment Types ============

export interface Enrollment {
    _id: string;
    user: string;
    course: Course;
    progress: number;
    completedLessons: string[];
    enrolledAt: string;
    completedAt?: string;
}

export interface EnrollmentListResponse {
    success: boolean;
    data: {
        enrollments: Enrollment[];
    };
}

export interface EnrollmentResponse {
    success: boolean;
    data: Enrollment;
}

// ============ API Response Wrapper ============

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}
