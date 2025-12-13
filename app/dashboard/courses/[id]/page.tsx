'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import { Play } from 'lucide-react';
import { toast } from 'sonner';

export default function CourseLearnPage() {
    const params = useParams();
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLessonDetails();
    }, [params.id]);

    const fetchLessonDetails = async () => {
        try {
            const lessonsRes = await api.lessons.getCourseLessons(params.id as string);
            setCurrentLesson(lessonsRes.data.data.lessons[0]);
        } catch (error) {
            toast.error('Failed to load course');
        } finally {
            setLoading(false);
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

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                        {currentLesson?.videoUrl ? (
                            <video
                                src={currentLesson.videoUrl}
                                controls
                                className="w-full h-full rounded-lg"
                            />
                        ) : (
                            <div className="text-white text-center">
                                <Play className="h-16 w-16 mx-auto mb-4" />
                                <p>Video content would appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
