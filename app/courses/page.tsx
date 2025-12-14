'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/Navbar';
import { Search, Star, Users, Clock } from 'lucide-react';
import type { Course, CourseListParams } from '@/types/api';

/**
 * Courses listing page with filtering and search
 */
export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [level, setLevel] = useState('all');

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            const params: CourseListParams = {};
            if (category !== 'all') params.category = category;
            if (level !== 'all') params.level = level;
            if (search) params.search = search;

            const response = await api.courses.getAll(params);
            setCourses(response.data.data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    }, [category, level, search]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCourses();
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">Explore Courses</h1>
                        <p className="text-gray-600">Discover your next learning adventure</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4">
                            <div className="md:col-span-2 relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search courses..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Web Development">Web Development</SelectItem>
                                    <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                                    <SelectItem value="Data Science">Data Science</SelectItem>
                                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                                    <SelectItem value="DevOps">DevOps</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={level} onValueChange={setLevel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </form>
                    </div>

                    {/* Course Grid */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Card key={i}>
                                    <Skeleton className="h-48 w-full" />
                                    <CardHeader>
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-20" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No courses found</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <Card key={course._id} className="hover:shadow-lg transition-shadow overflow-hidden">
                                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                                        {course.thumbnail ? (
                                            <Image
                                                src={course.thumbnail}
                                                alt={course.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover"
                                                priority={false}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-white text-6xl font-bold">
                                                {course.title.charAt(0)}
                                            </div>
                                        )}
                                        <Badge className="absolute top-4 right-4 bg-white text-gray-900">
                                            {course.level}
                                        </Badge>
                                    </div>

                                    <CardHeader>
                                        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {course.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span>{course.rating.toFixed(1)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{course.enrollmentCount}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{course.duration}h</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-500">By {course.instructor.name}</p>
                                                <p className="text-2xl font-bold text-primary">
                                                    {course.price === 0 ? 'Free' : `$${course.price}`}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter>
                                        <Button asChild className="w-full">
                                            <Link href={`/courses/${course._id}`}>View Course</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
