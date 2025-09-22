'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Lesson } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';
import { BarChart3, Home } from 'lucide-react';

interface LessonNavigationProps {
  courseId?: number;
  currentLessonId: number;
  onLessonCompleted?: () => void;
}

export default function LessonNavigation({ courseId, currentLessonId, onLessonCompleted }: LessonNavigationProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (courseId) {
      fetchLessons();
      fetchCompletedLessons();
    }
  }, [courseId, user]);

  useEffect(() => {
    if (onLessonCompleted) {
      fetchCompletedLessons();
    }
  }, [onLessonCompleted]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('courseid', courseId)
        .order('orderindex');

      if (error) throw error;

      setLessons(data || []);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Không thể tải danh sách bài học');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedLessons = async () => {
    if (!user || !courseId) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('progress_type', 'completed');

      if (error) throw error;

      const completed = new Set(data?.map(item => item.lesson_id) || []);
      setCompletedLessons(completed);
    } catch (err) {
      console.error('Error fetching completed lessons:', err);
    }
  };

  const getCurrentLessonIndex = () => {
    return lessons.findIndex(lesson => lesson.id === currentLessonId);
  };

  const getNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  };

  const getPrevLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex > 0 ? lessons[currentIndex - 1] : null;
  };

  const getLessonStatus = (lesson: Lesson) => {
    if (lesson.id === currentLessonId) {
      return 'current';
    }
    if (completedLessons.has(lesson.id)) {
      return 'completed';
    }
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'current':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'locked':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        );
      case 'current':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      case 'locked':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Danh sách bài học
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Danh sách bài học
        </h3>
        <div className="text-center text-red-600">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const nextLesson = getNextLesson();
  const prevLesson = getPrevLesson();

  return (
    <div className="space-y-6">
      {/* Dashboard Button */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Điều hướng
        </h3>
        
        <div className="space-y-3">
          {/* Dashboard Link */}
          <Link
            href="/dashboard"
            className="flex items-center p-3 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            <div>
              <p className="font-medium">Dashboard</p>
              <p className="text-xs opacity-75">Xem tiến độ học tập</p>
            </div>
          </Link>

          {/* Home Link */}
          <Link
            href="/"
            className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Home className="w-4 h-4 mr-3" />
            <div>
              <p className="font-medium">Trang chủ</p>
              <p className="text-xs text-gray-500">Về trang chủ</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Bài học
        </h3>
        
        <div className="space-y-3">
          {/* Previous Lesson */}
          {prevLesson ? (
            <Link
              href={`/lessons/${prevLesson.id}`}
              className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div>
                <p className="font-medium">Bài trước</p>
                <p className="text-xs text-gray-500 truncate">{prevLesson.title}</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center p-3 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-lg">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div>
                <p className="font-medium">Bài trước</p>
                <p className="text-xs">Không có</p>
              </div>
            </div>
          )}

          {/* Next Lesson */}
          {nextLesson ? (
            <Link
              href={`/lessons/${nextLesson.id}`}
              className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 text-right">
                <p className="font-medium">Bài tiếp theo</p>
                <p className="text-xs text-gray-500 truncate">{nextLesson.title}</p>
              </div>
              <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div className="flex items-center p-3 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex-1 text-right">
                <p className="font-medium">Bài tiếp theo</p>
                <p className="text-xs">Không có</p>
              </div>
              <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Lesson List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Danh sách bài học
        </h3>
        
        <div className="space-y-2">
          {lessons.map((lesson) => {
            const status = getLessonStatus(lesson);
            const isCurrent = lesson.id === currentLessonId;
            
            return (
              <div key={lesson.id}>
                {isCurrent ? (
                  <div className={`flex items-center p-3 text-sm font-medium border rounded-lg ${getStatusColor(status)}`}>
                    <div className="mr-3">
                      {getStatusIcon(status)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Bài {lesson.orderindex}</p>
                      <p className="text-xs opacity-75 truncate">{lesson.title}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full">
                      Hiện tại
                    </span>
                  </div>
                ) : (
                  <Link
                    href={`/lessons/${lesson.id}`}
                    className={`flex items-center p-3 text-sm font-medium border rounded-lg hover:bg-gray-50 transition-colors ${getStatusColor(status)}`}
                  >
                    <div className="mr-3">
                      {getStatusIcon(status)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Bài {lesson.orderindex}</p>
                      <p className="text-xs opacity-75 truncate">{lesson.title}</p>
                    </div>
                    {status === 'completed' && (
                      <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-full">
                        Hoàn thành
                      </span>
                    )}
                    {status === 'pending' && (
                      <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                        Bắt đầu
                      </span>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}