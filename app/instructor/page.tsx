/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { Plus, BookOpen, Users, Star, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function InstructorDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session.user.role !== 'instructor' && session.user.role !== 'admin') {
                toast.error('Access denied');
                router.push('/dashboard');
            } else {
                fetchCourses();
            }
        }
    }, [status, session]);

    const fetchCourses = async () => {
        try {
            const response = await api.courses.getInstructorCourses();
            setCourses(response.data.data.courses);
        } catch (error) {
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;

        try {
            await api.courses.delete(courseId);
            toast.success('Course deleted successfully');
            fetchCourses();
        } catch (error) {
            toast.error('Failed to delete course');
        }
    };

    const handleTogglePublish = async (courseId: string) => {
        try {
            await api.courses.togglePublish(courseId);
            toast.success('Course status updated');
            fetchCourses();
        } catch (error) {
            toast.error('Failed to update course');
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-8">Loading...</div>
            </>
        );
    }

    const totalEnrollments = courses.reduce((sum, c) => sum + c.enrollmentCount, 0);
    const publishedCourses = courses.filter(c => c.status === 'published').length;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Instructor Dashboard</h1>
                            <p className="text-gray-600">Manage your courses</p>
                        </div>
                        <Button asChild>
                            <Link href="/instructor/courses/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Course
                            </Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{courses.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    {publishedCourses} published
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalEnrollments}</div>
                                <p className="text-xs text-muted-foreground">Across all courses</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {courses.length > 0
                                        ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)
                                        : '0.0'}
                                </div>
                                <p className="text-xs text-muted-foreground">From student reviews</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Courses List */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Your Courses</h2>

                        {courses.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-16">
                                    <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
                                    <p className="text-gray-600 mb-4">Create your first course to get started</p>
                                    <Button asChild>
                                        <Link href="/instructor/courses/new">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Course
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {courses.map((course) => (
                                    <Card key={course._id}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-6">
                                                <div className="w-32 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0 overflow-hidden">
                                                    {course.thumbnail ? (
                                                        <img
                                                            src={course.thumbnail}
                                                            alt={course.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-white text-3xl font-bold">
                                                            {course.title.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                                                            <p className="text-gray-600 mb-2 line-clamp-2">
                                                                {course.description}
                                                            </p>
                                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                <span className="flex items-center gap-1">
                                                                    <Users className="h-4 w-4" />
                                                                    {course.enrollmentCount} students
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                    {course.rating.toFixed(1)}
                                                                </span>
                                                                <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                                                                    {course.status}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={`/instructor/courses/${course._id}/edit`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleTogglePublish(course._id)}
                                                            >
                                                                {course.status === 'published' ? 'Unpublish' : 'Publish'}
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDelete(course._id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
