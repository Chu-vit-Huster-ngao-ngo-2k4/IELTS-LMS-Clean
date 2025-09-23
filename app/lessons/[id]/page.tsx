'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/components/AuthProvider';
import { useProgress } from '@/hooks/useProgress';
import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import AudioPlayerWrapper from '@/components/AudioPlayerWrapper';
import ListeningLessonViewer from '@/components/ListeningLessonViewer';
import ExerciseSection from '@/components/ExerciseSection';
import ExerciseQuiz from '@/components/ExerciseQuiz';
import ProgressTracker from '@/components/ProgressTracker';
import LessonNavigation from '@/components/LessonNavigation';
import { Lesson, Asset, Course } from '@/lib/types';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user, loading: authLoading } = useAuth();
  const { markAsStarted, markAsCompleted, fetchCourseProgress } = useProgress();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [videos, setVideos] = useState<Asset[]>([]);
  const [audios, setAudios] = useState<Asset[]>([]);
  const [exercises, setExercises] = useState<Asset[]>([]);
  const [answers, setAnswers] = useState<Asset[]>([]);
  const [images, setImages] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  const lessonId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (lessonId && user) {
      fetchLessonData();
    }
  }, [lessonId, user]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      
      // Fetch lesson data
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select(`
          *,
          courses:courseid (
            id,
            title,
            description
          )
        `)
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;

      setLesson(lessonData);
      setCourse(lessonData.courses);

      // Mark lesson as started
      if (lessonData.courses) {
        await markAsStarted(lessonData.courses.id, lessonData.id, 0);
      }

      // Fetch assets for this lesson
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .eq('lessonid', lessonId)
        .order('id');

      if (assetsError) throw assetsError;

      setAssets(assetsData || []);

      // Categorize assets
      const videoAssets = assetsData?.filter(asset => asset.assettype === 'video') || [];
      const audioAssets = assetsData?.filter(asset => asset.assettype === 'audio') || [];
      const exerciseAssets = assetsData?.filter(asset => 
        asset.assettype === 'document' && 
        asset.mimetype === 'application/pdf' &&
        (asset.title.includes('exercise') || asset.title.includes('handout'))
      ) || [];
      const answerAssets = assetsData?.filter(asset => 
        asset.assettype === 'document' && 
        asset.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        asset.title.includes('answer')
      ) || [];
      const imageAssets = assetsData?.filter(asset => asset.assettype === 'image') || [];

      setVideos(videoAssets);
      setAudios(audioAssets);
      setExercises(exerciseAssets);
      setAnswers(answerAssets);
      setImages(imageAssets);

    } catch (err) {
      console.error('Error fetching lesson data:', err);
      setError('Không thể tải dữ liệu bài học');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoComplete = () => {
    setVideoCompleted(true);
    // Show exercises if available for vocabulary or pronunciation lessons
    if (exercises.length > 0 && (course?.id === 1 || course?.id === 3)) {
      setShowExercises(true);
    }
    // Update progress in database
    updateProgress('video_completed');
  };

  const handleExerciseComplete = () => {
    setExerciseCompleted(true);
    // Update progress in database
    updateProgress('exercise_completed');
  };

  const updateProgress = async (status: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use the new progress system
      if (status === 'video_completed') {
        // Mark video as completed (100%) - this completes the entire lesson
        if (videos.length > 0) {
          await markAsCompleted(course?.id || 0, parseInt(lessonId, 10), parseInt(videos[0]?.id ?? '0', 10), 300);
        }
        
        // Also mark exercise as completed if it exists (optional)
        if (exercises.length > 0) {
          await markAsCompleted(course?.id || 0, parseInt(lessonId, 10), parseInt(exercises[0]?.id ?? '0', 10), 0);
        }
        
        // Refresh dashboard data
        await fetchCourseProgress();
      } else if (status === 'exercise_completed') {
        // Mark exercise as completed (100%)
        if (exercises.length > 0) {
          await markAsCompleted(course?.id || 0, parseInt(lessonId, 10), parseInt(exercises[0]?.id ?? '0', 10), 0);
        }
        
        // Refresh dashboard data
        await fetchCourseProgress();
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };


  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài học</h2>
          <p className="text-gray-600 mb-4">{error || 'Bài học không tồn tại'}</p>
          <button
            onClick={() => {
              try {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  router.push('/simple-courses');
                }
              } catch (error) {
                router.push('/simple-courses');
              }
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        showBackButton={true} 
        backUrl={`/courses/${course?.id}`} 
        title={`${course?.title} - ${lesson.title}`}
        showAuth={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Section */}
            {videos.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
                   Video Bài Học
                 </h2>
                
                 <VideoPlayer
                   videos={videos}
                   currentIndex={currentVideoIndex}
                   onVideoChange={setCurrentVideoIndex}
                   onComplete={handleVideoComplete}
                   isCompleted={videoCompleted}
                 />
                 
                 {/* Video Navigation - Outside video player */}
                 {videos.length > 1 && (
                   <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-lg p-4">
                     <div className="flex items-center space-x-2">
                       <span className="text-sm font-medium text-gray-700">
                         Video {currentVideoIndex + 1} / {videos.length}
                       </span>
                     </div>
                     
                     <div className="flex items-center space-x-3">
                       <button
                         onClick={() => setCurrentVideoIndex(currentVideoIndex - 1)}
                         disabled={currentVideoIndex === 0}
                         className="px-4 py-2 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-300"
                       >
                         ← Video trước
                       </button>
                       
                       <button
                         onClick={() => setCurrentVideoIndex(currentVideoIndex + 1)}
                         disabled={currentVideoIndex === videos.length - 1}
                         className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                       >
                         Video tiếp theo →
                       </button>
                     </div>
                   </div>
                 )}
                
                {/* Skip to exercises button */}
                {!videoCompleted && exercises.length > 0 && course?.id === 1 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        setVideoCompleted(true);
                        setShowExercises(true);
                        updateProgress('video_completed');
                      }}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Bỏ qua video và làm bài tập
                    </button>
                  </div>
                )}
              </div>
            )}


      {/* Exercise Quiz - Always show for vocabulary and pronunciation lessons if exercises available */}
      {exercises.length > 0 && (course?.id === 1 || course?.id === 3) && (
        <ExerciseQuiz
          exercises={exercises}
          answers={answers}
          audios={audios}
          onComplete={handleExerciseComplete}
        />
      )}

            {/* Listening Lesson Viewer */}
            {audios.length > 0 && course?.id === 4 && (
              <ListeningLessonViewer
                audios={audios}
                exercises={exercises}
                answers={answers}
                onComplete={handleExerciseComplete}
              />
            )}

            {/* Regular Exercise Section for non-listening lessons */}
            {audios.length === 0 && (exercises.length > 0 || images.length > 0) && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  📄 Bài Tập & Tài Liệu
                </h2>
                
                <ExerciseSection
                  exercises={exercises}
                  images={images}
                  onComplete={handleExerciseComplete}
                  isCompleted={exerciseCompleted}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Tracker */}
            <ProgressTracker
              lesson={lesson}
              videoCompleted={videoCompleted}
              exerciseCompleted={exerciseCompleted}
            />

            {/* Lesson Navigation */}
            <LessonNavigation
              courseId={course?.id}
              currentLessonId={parseInt(lessonId, 10)}
              onLessonCompleted={() => {
                // This will trigger refresh of completed lessons
                setVideoCompleted(false);
                setExerciseCompleted(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}