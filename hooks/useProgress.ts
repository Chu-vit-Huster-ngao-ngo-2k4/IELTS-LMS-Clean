import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { createClient } from '@supabase/supabase-js';

export interface UserProgress {
  id: number;
  user_id: string;
  course_id: number;
  lesson_id: number;
  asset_id: number;
  progress_type: 'started' | 'completed' | 'in_progress';
  completion_percentage: number;
  time_spent: number;
  last_accessed: string;
  completed_at?: string;
}

export interface UserCourseProgress {
  id: number;
  user_id: string;
  course_id: number;
  total_lessons: number;
  completed_lessons: number;
  total_assets: number;
  completed_assets: number;
  overall_progress: number;
  started_at: string;
  completed_at?: string;
  last_accessed: string;
}

export interface UserAchievement {
  id: number;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export const useProgress = () => {
  const { user } = useAuth();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [loading, setLoading] = useState(false);
  const [courseProgress, setCourseProgress] = useState<UserCourseProgress[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);

  // Get user's course progress
  const fetchCourseProgress = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_accessed', { ascending: false });

      if (error) throw error;
      setCourseProgress(data || []);
    } catch (error) {
      console.error('Error fetching course progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // Get user's achievements
  const fetchAchievements = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  }, [user, supabase]);

  // Mark lesson/asset as started
  const markAsStarted = useCallback(async (
    courseId: number,
    lessonId: number,
    assetId: number
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          asset_id: assetId,
          progress_type: 'started',
          completion_percentage: 0,
          time_spent: 0,
          last_accessed: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id,asset_id'
        });

      if (error) throw error;

      // Update course progress
      await supabase.rpc('update_course_progress', {
        p_user_id: user.id,
        p_course_id: courseId
      });

      // Check for first lesson achievement
      await supabase.rpc('check_achievements', {
        p_user_id: user.id,
        p_achievement_type: 'first_lesson'
      });

      // Refresh progress data
      await fetchCourseProgress();
    } catch (error) {
      console.error('Error marking as started:', error);
    }
  }, [user, supabase, fetchCourseProgress]);

  // Mark lesson/asset as completed
  const markAsCompleted = useCallback(async (
    courseId: number,
    lessonId: number,
    assetId: number,
    timeSpent: number = 0
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          asset_id: assetId,
          progress_type: 'completed',
          completion_percentage: 100,
          time_spent: timeSpent,
          last_accessed: new Date().toISOString(),
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id,asset_id'
        });

      if (error) throw error;

      // Update course progress
      await supabase.rpc('update_course_progress', {
        p_user_id: user.id,
        p_course_id: courseId
      });

      // Check for course completion achievement
      await supabase.rpc('check_achievements', {
        p_user_id: user.id,
        p_achievement_type: 'course_completed'
      });

      // Refresh progress data
      await fetchCourseProgress();
      await fetchAchievements();
    } catch (error) {
      console.error('Error marking as completed:', error);
    }
  }, [user, supabase, fetchCourseProgress, fetchAchievements]);

  // Update progress percentage
  const updateProgress = useCallback(async (
    courseId: number,
    lessonId: number,
    assetId: number,
    percentage: number,
    timeSpent: number = 0
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          asset_id: assetId,
          progress_type: percentage === 100 ? 'completed' : 'in_progress',
          completion_percentage: percentage,
          time_spent: timeSpent,
          last_accessed: new Date().toISOString(),
          completed_at: percentage === 100 ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,lesson_id,asset_id'
        });

      if (error) throw error;

      // Update course progress
      await supabase.rpc('update_course_progress', {
        p_user_id: user.id,
        p_course_id: courseId
      });

      // Refresh progress data
      await fetchCourseProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, [user, supabase, fetchCourseProgress]);

  // Get progress for specific lesson
  const getLessonProgress = useCallback(async (lessonId: number) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      return null;
    }
  }, [user, supabase]);

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchCourseProgress();
      fetchAchievements();
    }
  }, [user, fetchCourseProgress, fetchAchievements]);

  return {
    loading,
    courseProgress,
    achievements,
    markAsStarted,
    markAsCompleted,
    updateProgress,
    getLessonProgress,
    fetchCourseProgress,
    fetchAchievements
  };
};
