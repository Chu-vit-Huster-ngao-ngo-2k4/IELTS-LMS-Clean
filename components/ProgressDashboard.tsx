'use client';

import { useState, useEffect } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/components/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp,
  Award,
  Calendar,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function ProgressDashboard() {
  const { user } = useAuth();
  const { courseProgress, achievements, loading, fetchCourseProgress } = useProgress();
  const [courseNames, setCourseNames] = useState<Record<number, string>>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const supabase = createClientComponentClient();

  // Force refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCourseProgress();
      setRefreshKey(prev => prev + 1);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchCourseProgress]);

  // Fetch course names
  useEffect(() => {
    const fetchCourseNames = async () => {
      if (courseProgress.length === 0) return;

      try {
        const courseIds = courseProgress.map(cp => cp.course_id);
        const { data: courses, error } = await supabase
          .from('courses')
          .select('id, title')
          .in('id', courseIds);

        if (error) {
          console.error('Error fetching course names:', error);
          return;
        }

        const names: Record<number, string> = {};
        courses?.forEach(course => {
          names[course.id] = course.title;
        });
        setCourseNames(names);
      } catch (error) {
        console.error('Error fetching course names:', error);
      }
    };

    fetchCourseNames();
  }, [courseProgress, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalCourses = courseProgress.length;
  const completedCourses = courseProgress.filter(cp => cp.overall_progress === 100).length;
  const inProgressCourses = courseProgress.filter(cp => cp.overall_progress > 0 && cp.overall_progress < 100).length;
  const totalLessons = courseProgress.reduce((sum, cp) => sum + cp.total_lessons, 0);
  const completedLessons = courseProgress.reduce((sum, cp) => sum + cp.completed_lessons, 0);
  const totalAssets = courseProgress.reduce((sum, cp) => sum + cp.total_assets, 0);
  const completedAssets = courseProgress.reduce((sum, cp) => sum + cp.completed_assets, 0);

  // Calculate overall progress based on courses that user has actually started
  // Only count courses where user has made some progress (overall_progress > 0)
  const coursesWithProgress = courseProgress.filter(cp => cp.overall_progress > 0);
  const totalAssetsWithProgress = coursesWithProgress.reduce((sum, cp) => sum + cp.total_assets, 0);
  const completedAssetsWithProgress = coursesWithProgress.reduce((sum, cp) => sum + cp.completed_assets, 0);
  const overallProgress = totalAssetsWithProgress > 0 ? Math.round((completedAssetsWithProgress / totalAssetsWithProgress) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Chào mừng trở lại, {user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-blue-100">
          Tiếp tục hành trình học IELTS của bạn
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Khóa học</p>
              <p className="text-2xl font-semibold text-gray-900">
                {completedCourses}/{totalCourses}
              </p>
              <p className="text-xs text-gray-500">Hoàn thành</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Bài học</p>
              <p className="text-2xl font-semibold text-gray-900">
                {completedLessons}/{totalLessons}
              </p>
              <p className="text-xs text-gray-500">Hoàn thành</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tiến độ tổng</p>
              <p className="text-2xl font-semibold text-gray-900">
                {overallProgress}%
              </p>
              <p className="text-xs text-gray-500">Tổng thể</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Thành tích</p>
              <p className="text-2xl font-semibold text-gray-900">
                {achievements.length}
              </p>
              <p className="text-xs text-gray-500">Đã đạt được</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Tiến độ học tập</h3>
          <button
            onClick={() => {
              fetchCourseProgress();
              setRefreshKey(prev => prev + 1);
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            🔄 Làm mới
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {courseProgress.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Bạn chưa bắt đầu khóa học nào</p>
                <Link
                  href="/courses"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Khám phá khóa học
                </Link>
              </div>
            ) : (
              courseProgress.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.course_id}`}
                  className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {courseNames[course.course_id] || `Khóa học #${course.course_id}`}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {course.overall_progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.overall_progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{course.completed_assets}/{course.total_assets} nội dung</span>
                    <span>{course.completed_lessons}/{course.total_lessons} bài học</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Thành tích đạt được</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl mr-3">{achievement.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{achievement.achievement_name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(achievement.earned_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Hành động nhanh</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/courses"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Khám phá khóa học</h4>
                <p className="text-sm text-gray-500">Xem tất cả khóa học có sẵn</p>
              </div>
            </Link>
            
            <Link
              href="/dashboard"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Tiếp tục học</h4>
                <p className="text-sm text-gray-500">Xem khóa học đang học</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}