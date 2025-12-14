'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { CreateCoursePayload, Course } from '@/types/api';

export default function EditCoursePage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        duration: '',
        level: '',
        thumbnail: '',
    });

    const fetchCourse = useCallback(async () => {
        try {
            const response = await api.courses.getOne(params.id as string);
            const course: Course = response.data.data.course;

            setFormData({
                title: course.title,
                description: course.description,
                category: course.category,
                price: course.price.toString(),
                duration: course.duration.toString(),
                level: course.level,
                thumbnail: course.thumbnail || '',
            });
        } catch {
            toast.error('Failed to load course');
            router.push('/instructor');
        } finally {
            setLoading(false);
        }
    }, [params.id, router]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const courseData: Partial<CreateCoursePayload> = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                price: parseFloat(formData.price),
                level: formData.level as 'beginner' | 'intermediate' | 'advanced',
                thumbnail: formData.thumbnail || undefined,
            };

            await api.courses.update(params.id as string, courseData);
            toast.success('Course updated successfully!');
            router.push('/instructor');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to update course');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            return;
        }

        setDeleting(true);
        try {
            await api.courses.delete(params.id as string);
            toast.success('Course deleted successfully');
            router.push('/instructor');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to delete course');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <Skeleton className="h-10 w-40 mb-6" />
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-8 w-1/2" />
                                <Skeleton className="h-4 w-3/4" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-32 w-full" />
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-3xl">
                    <Button variant="ghost" asChild className="mb-6">
                        <Link href="/instructor">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-3xl">Edit Course</CardTitle>
                                    <CardDescription>
                                        Update your course details
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    title="Delete course"
                                >
                                    {deleting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Course Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Complete Web Development Bootcamp"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        minLength={5}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe what students will learn in this course..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        minLength={20}
                                        rows={5}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category *</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Web Development">Web Development</SelectItem>
                                                <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                                                <SelectItem value="Data Science">Data Science</SelectItem>
                                                <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                                                <SelectItem value="DevOps">DevOps</SelectItem>
                                                <SelectItem value="Design">Design</SelectItem>
                                                <SelectItem value="Business">Business</SelectItem>
                                                <SelectItem value="Marketing">Marketing</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="level">Level *</Label>
                                        <Select
                                            value={formData.level}
                                            onValueChange={(value) => setFormData({ ...formData, level: value })}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="beginner">Beginner</SelectItem>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (USD) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                        <p className="text-sm text-gray-500">Enter 0 for free courses</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Duration (hours) *</Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            placeholder="10"
                                            min="1"
                                            step="0.5"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="thumbnail">Thumbnail URL (Optional)</Label>
                                    <Input
                                        id="thumbnail"
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.thumbnail}
                                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={saving} className="flex-1">
                                        {saving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/instructor">Cancel</Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
