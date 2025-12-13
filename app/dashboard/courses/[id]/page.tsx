'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import { CheckCircle, Circle, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function CourseLearnPage() {
  const params = useParams();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollmentDetails();
  }, [params.id]);

  const fetchEnrollmentDetails = async () => {
    try {
      const [enrollmentRes, lessonsRes] = await Promise.all([
        api.enrollments.getEnrollment(params.id as string),
        api.lessons.getCourseLessons(params.id as string),
      ]);

      setEnrollment(enrollmentRes.data.data.enrollment);
      setLessons(lessonsRes.data.data.lessons);
      
      // Set first incomplete lesson as current
      const firstIncomplete = lessonsRes.data.data.lessons.find(
        (l: any) => !enrollmentRes.data.data.enrollment.completedLessons.includes(l._id)
      );
      setCurrentLesson(firstIncomplete || lessonsRes.data.data.lessons[0]);
    } catch (error) {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async (lessonId: string) => {
    try {
      await api.enrollments.completeLesson(params.id as string, lessonId);
      toast.success('Lesson completed!');
      
      // Refresh enrollment data
      const enrollmentRes = await api.enrollments.getEnrollment(params.id as string);
      setEnrollment(enrollmentRes.data.data.enrollment);

      // Move to next lesson
      const currentIndex = lessons.findIndex(l => l._id === lessonId);
      if (currentIndex < lessons.length - 1) {
        setCurrentLesson(lessons[currentIndex + 1]);
      }
    } catch (error) {
      toast.error('Failed to mark lesson as complete');
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return enrollment?.completedLessons?.includes(lessonId);
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{currentLesson?.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Video Player Placeholder */}
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

                  {/* Lesson Content */}
                  <div className="prose max-w-none">
                    <h3>Lesson Description</h3>
                    <p>{currentLesson?.content}</p>
                  </div>

                  <Separator />

                  {/* Resources */}
                  {currentLesson?.resources && currentLesson.resources.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Resources</h3>
                      <div className="space-y-2">
                        {currentLesson.resources.map((resource: any, index: number) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:underline"
                          >
                            {resource.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {!isLessonCompleted(currentLesson?._id) && (
                      <Button 
                        onClick={() => handleCompleteLesson(currentLesson._id)}
                        className="flex-1"
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Lesson List */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Your Progress</span>
                      <span className="font-semibold">{enrollment?.progress || 0}%</span>
                    </div>
                    <Progress value={enrollment?.progress || 0} className="h-2" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lessons.map((lesson, index) => {
                      const completed = isLessonCompleted(lesson._id);
                      const isCurrent = currentLesson?._id === lesson._id;

                      return (
                        <button
                          key={lesson._id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            isCurrent
                              ? 'bg-primary text-white'
                              : completed
                              ? 'bg-green-50 hover:bg-green-100'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {completed ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Circle className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm line-clamp-2">
                                {index + 1}. {lesson.title}
                              </p>
                              <p className="text-xs opacity-75 mt-1">
                                {lesson.duration} min
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
