'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/components/AuthProvider';
import VideoPlayer from '@/components/VideoPlayer';
import AudioPlayerWrapper from '@/components/AudioPlayerWrapper';
import ListeningLessonViewer from '@/components/ListeningLessonViewer';
import ExerciseSection from '@/components/ExerciseSection';
import ExerciseQuiz from '@/components/ExerciseQuiz';
import ProgressTracker from '@/components/ProgressTracker';
import LessonNavigation from '@/components/LessonNavigation';
import { Lesson, Asset, Course } from '@/lib/types';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Monitor, 
  Star, 
  Mic, 
  MessageCircle, 
  BarChart3, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Square,
  ChevronRight,
  Play,
  Clock,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user, loading: authLoading } = useAuth();
  
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
      // Fetch lesson info
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select(`
          *,
          course:courseid(*)
        `)
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;

      // Fetch assets for this lesson
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .eq('lessonid', lessonId)
        .order('createdat');

      if (assetsError) throw assetsError;

      setLesson(lessonData);
      setCourse(lessonData.course);
      setAssets(assetsData || []);

      // Categorize assets
      const videoAssets = (assetsData || []).filter(asset => 
        asset.mimetype?.startsWith('video/')
      );
      const audioAssets = (assetsData || []).filter(asset => 
        asset.mimetype?.startsWith('audio/')
      );
      const exerciseAssets = (assetsData || []).filter(asset => 
        asset.mimetype === 'application/pdf' && 
        (asset.title?.toLowerCase().includes('exercise') || asset.title?.toLowerCase().includes('handout'))
      );
      const answerAssets = (assetsData || []).filter(asset => 
        asset.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        asset.title?.toLowerCase().includes('answer')
      );
      const imageAssets = (assetsData || []).filter(asset => 
        asset.mimetype?.startsWith('image/')
      );

      setVideos(videoAssets);
      setAudios(audioAssets);
      setExercises(exerciseAssets);
      setAnswers(answerAssets);
      setImages(imageAssets);

    } catch (error) {
      console.error('Error fetching lesson data:', error);
      setError('Không thể tải dữ liệu bài học');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoComplete = () => {
    setVideoCompleted(true);
    if (exercises.length > 0 && (course?.id === 1 || course?.id === 3)) {
      setShowExercises(true);
    }
  };

  const handleExerciseComplete = () => {
    setExerciseCompleted(true);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Không tìm thấy bài học'}
          </h1>
          <Link href="/courses" className="text-red-600 hover:text-red-700">
            Quay lại danh sách khóa học
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar - Red Navigation */}
      <div className="w-64 bg-red-600 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-red-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center mr-3">
              <div className="w-0 h-0 border-l-[8px] border-l-red-600 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>
            </div>
            <h1 className="text-xl font-bold">IELTS LMS</h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="flex items-center p-3 rounded-lg text-red-100 hover:bg-red-700 hover:text-white transition-colors">
                <Home className="h-5 w-5 mr-3" />
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/courses" className="flex items-center p-3 rounded-lg text-red-100 hover:bg-red-700 hover:text-white transition-colors">
                <BookOpen className="h-5 w-5 mr-3" />
                Khóa học của tôi
              </Link>
            </li>
            <li>
              <Link href="/calendar" className="flex items-center p-3 rounded-lg text-red-100 hover:bg-red-700 hover:text-white transition-colors">
                <Calendar className="h-5 w-5 mr-3" />
                Lịch học
              </Link>
            </li>
            <li>
              <Link href="/lessons" className="flex items-center p-3 rounded-lg bg-red-700 text-white">
                <Monitor className="h-5 w-5 mr-3" />
                Bài học
              </Link>
            </li>
            <li>
              <Link href="/evaluations" className="flex items-center p-3 rounded-lg text-red-100 hover:bg-red-700 hover:text-white transition-colors">
                <Star className="h-5 w-5 mr-3" />
                Đánh giá
              </Link>
            </li>
            <li>
              <Link href="/speakai" className="flex items-center p-3 rounded-lg text-red-100 hover:bg-red-700 hover:text-white transition-colors">
                <Mic className="h-5 w-5 mr-3" />
                IELTS AI
              </Link>
            </li>
            <li>
              <Link href="/messages" className="flex items-center p-3 rounded-lg text-red-100 hover:bg-red-700 hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5 mr-3" />
                Tin nhắn
              </Link>
            </li>
            <li>
              <Link href="/performance" className="flex items-center p-3 rounded-lg text-red-100 hover:bg-red-700 hover:text-white transition-colors">
                <BarChart3 className="h-5 w-5 mr-3" />
                Hiệu suất
              </Link>
            </li>
            <li>
              <Link href="/settings" className="flex items-center p-3 rounded-lg text-red-100 hover:bg-red-700 hover:text-white transition-colors">
                <Settings className="h-5 w-5 mr-3" />
                Cài đặt
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-red-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 font-bold text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{user.email?.split('@')[0]}</p>
              <p className="text-xs text-red-200">IELTS Student</p>
            </div>
            <button className="text-red-200 hover:text-white">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href={`/courses/${course?.id}`} className="mr-4 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm nội dung..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Square className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Lesson Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{lesson.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {course?.title}
                  </div>
                  <div className="flex items-center">
                    <Play className="h-5 w-5 mr-2" />
                    {assets.length} tài liệu
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    ~{Math.ceil(assets.length * 0.3)} phút
                  </div>
                </div>
              </div>
              
              <div className="ml-8">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-24 h-24 rounded-2xl flex items-center justify-center">
                  <Monitor className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="space-y-8">
            {/* Video Section */}
            {videos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Video bài giảng</h2>
                <VideoPlayer
                  videos={videos}
                  currentIndex={currentVideoIndex}
                  onVideoComplete={handleVideoComplete}
                  onVideoChange={setCurrentVideoIndex}
                />
              </div>
            )}

            {/* Listening Section */}
            {audios.length > 0 && course?.id === 4 && (
              <ListeningLessonViewer
                audios={audios}
                exercises={exercises}
                answers={answers}
                onComplete={handleExerciseComplete}
              />
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

            {/* Exercise Section - Show for other courses */}
            {exercises.length > 0 && course?.id !== 1 && course?.id !== 3 && course?.id !== 4 && (
              <ExerciseSection
                exercises={exercises}
                answers={answers}
                onComplete={handleExerciseComplete}
              />
            )}

            {/* Images Section */}
            {images.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Hình ảnh minh họa</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={`/api/r2-sign?key=${image.providerkey}`}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}