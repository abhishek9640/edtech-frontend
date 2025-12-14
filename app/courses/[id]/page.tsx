'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import { Star, Users, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Course, Lesson } from '@/types/api';

/**
 * Course detail page with lessons and enrollment
 */
export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    const fetchCourse = useCallback(async () => {
        try {
            const response = await api.courses.getOne(params.id as string);
            setCourse(response.data.data.course);
            setLessons(response.data.data.lessons);
        } catch {
            toast.error('Failed to load course');
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    const checkEnrollment = useCallback(async () => {
        if (!session) return;

        try {
            const response = await api.enrollments.getEnrollment(params.id as string);
            setIsEnrolled(!!response.data);
        } catch {
            // Not enrolled - this is expected
        }
    }, [session, params.id]);

    useEffect(() => {
        fetchCourse();
        checkEnrollment();
    }, [fetchCourse, checkEnrollment]);

    const handleEnroll = async () => {
        if (!session) {
            router.push('/login');
            return;
        }

        setEnrolling(true);
        try {
            await api.enrollments.enroll(params.id as string);
            toast.success('Successfully enrolled!');
            setIsEnrolled(true);
            router.push(`/dashboard/courses/${params.id}`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to enroll');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </>
        );
    }

    if (!course) return null;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <Badge className="mb-4 bg-white text-gray-900">{course.category}</Badge>
                                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                                <p className="text-xl opacity-90 mb-6">{course.description}</p>

                                <div className="flex flex-wrap items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold">{course.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        <span>{course.enrollmentCount} students</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        <span>{course.duration} hours</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        <span>{lessons.length} lessons</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-sm opacity-75">Instructor</p>
                                    <p className="text-lg font-semibold">{course.instructor.name}</p>
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <Card className="sticky top-20">
                                    <CardHeader>
                                        <CardTitle className="text-3xl">
                                            {course.price === 0 ? 'Free' : `$${course.price}`}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {isEnrolled ? (
                                            <Button className="w-full" asChild>
                                                <a href={`/dashboard/courses/${course._id}`}>Go to Course</a>
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full"
                                                onClick={handleEnroll}
                                                disabled={enrolling}
                                            >
                                                {enrolling ? 'Enrolling...' : 'Enroll Now'}
                                            </Button>
                                        )}

                                        <Separator className="my-6" />

                                        <div className="space-y-3">
                                            <h4 className="font-semibold">This course includes:</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span>{course.duration} hours on-demand video</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span>{lessons.length} lessons</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span>Lifetime access</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span>Certificate of completion</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4 py-12">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About This Course</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 leading-relaxed">{course.description}</p>

                                    <div className="mt-6">
                                        <h3 className="font-semibold mb-2">Level</h3>
                                        <Badge>{course.level}</Badge>
                                    </div>

                                    {course.tags && course.tags.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="font-semibold mb-2">Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {course.tags.map((tag: string, index: number) => (
                                                    <Badge key={index} variant="outline">{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="curriculum" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Course Curriculum</CardTitle>
                                    <CardDescription>{lessons.length} lessons</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {lessons.map((lesson, index) => (
                                            <div
                                                key={lesson._id}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{lesson.title}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">{lesson.duration} min</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Student Reviews</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {course.reviews && course.reviews.length > 0 ? (
                                        <div className="space-y-4">
                                            {course.reviews.map((review) => (
                                                <div key={review._id} className="border-b pb-4 last:border-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 ${i < review.rating
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-gray-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-600">
                                                            by {review.user?.name || 'Anonymous'}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700">{review.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No reviews yet</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
