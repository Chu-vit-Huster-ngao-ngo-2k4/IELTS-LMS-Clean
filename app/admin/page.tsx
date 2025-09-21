'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import CourseEditor from '@/components/CourseEditor';
import LessonEditor from '@/components/LessonEditor';
import AssetEditor from '@/components/AssetEditor';
import { Course, Lesson, Asset } from '@/lib/admin-types';
import { 
  BookOpen, 
  Users, 
  Settings, 
  Edit3, 
  Plus,
  BarChart3,
  FileText,
  Video,
  Music,
  Image as ImageIcon
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [showLessonEditor, setShowLessonEditor] = useState(false);
  const [showAssetEditor, setShowAssetEditor] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchCourses();
  }, [user, router]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          lessons(
            *,
            assets(*)
          )
        `)
        .order('id');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const handleCourseSave = (course: Course) => {
    if (course.id) {
      // Update existing course
      setCourses(courses.map(c => c.id === course.id ? course : c));
    } else {
      // Add new course
      setCourses([...courses, course]);
    }
    setEditingCourse(null);
  };

  const handleLessonSave = (lesson: Lesson) => {
    if (lesson.id) {
      // Update existing lesson
      setCourses(courses.map(course => 
        course.id === selectedCourse?.id 
          ? {
              ...course,
              lessons: course.lessons?.map(l => l.id === lesson.id ? lesson : l) || []
            }
          : course
      ));
    } else {
      // Add new lesson
      setCourses(courses.map(course => 
        course.id === selectedCourse?.id 
          ? {
              ...course,
              lessons: [...(course.lessons || []), lesson]
            }
          : course
      ));
    }
    setEditingLesson(null);
  };

  const handleAssetSave = (asset: Asset) => {
    if (asset.id) {
      // Update existing asset
      setCourses(courses.map(course => 
        course.id === selectedCourse?.id 
          ? {
              ...course,
              lessons: course.lessons?.map(lesson => 
                lesson.id === selectedLesson?.id
                  ? {
                      ...lesson,
                      assets: lesson.assets?.map(a => a.id === asset.id ? asset : a) || []
                    }
                  : lesson
              ) || []
            }
          : course
      ));
    } else {
      // Add new asset
      setCourses(courses.map(course => 
        course.id === selectedCourse?.id 
          ? {
              ...course,
              lessons: course.lessons?.map(lesson => 
                lesson.id === selectedLesson?.id
                  ? {
                      ...lesson,
                      assets: [...(lesson.assets || []), asset]
                    }
                  : lesson
              ) || []
            }
          : course
      ));
    }
    setEditingAsset(null);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowCourseEditor(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowLessonEditor(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setShowAssetEditor(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Admin Dashboard" showAuth={true} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Admin Dashboard" showAuth={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Lessons</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {courses.reduce((acc, course) => acc + (course.lessons?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assets</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {courses.reduce((acc, course) => 
                    acc + (course.lessons?.reduce((lessonAcc, lesson) => 
                      lessonAcc + (lesson.assets?.length || 0), 0) || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Courses</h3>
                  <button
                    onClick={() => {
                      setEditingCourse(null);
                      setShowCourseEditor(true);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Course
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedCourse?.id === course.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                    }`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-500">
                          {course.lessons?.length || 0} lessons
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCourse(course);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="lg:col-span-1">
            {selectedCourse ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Lessons - {selectedCourse.title}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingLesson(null);
                        setShowLessonEditor(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Lesson
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {selectedCourse.lessons?.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedLesson?.id === lesson.id ? 'bg-green-50 border-r-4 border-green-600' : ''
                      }`}
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {lesson.orderindex}. {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {lesson.assets?.length || 0} assets
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLesson(lesson);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a course to view lessons</p>
              </div>
            )}
          </div>

          {/* Assets List */}
          <div className="lg:col-span-1">
            {selectedLesson ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Assets - {selectedLesson.title}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingAsset(null);
                        setShowAssetEditor(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Asset
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {selectedLesson.assets?.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getAssetIcon(asset.assettype)}
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">
                              {asset.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {asset.assettype} • {formatFileSize(asset.sizebytes)}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-xs">
                              {asset.providerkey}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAsset(asset);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a lesson to view assets</p>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <CourseEditor
          course={editingCourse}
          isOpen={showCourseEditor}
          onClose={() => {
            setShowCourseEditor(false);
            setEditingCourse(null);
          }}
          onSave={handleCourseSave}
        />

        <LessonEditor
          lesson={editingLesson}
          courseId={selectedCourse?.id || 0}
          isOpen={showLessonEditor}
          onClose={() => {
            setShowLessonEditor(false);
            setEditingLesson(null);
          }}
          onSave={handleLessonSave}
        />

        <AssetEditor
          asset={editingAsset}
          lessonId={selectedLesson?.id || 0}
          isOpen={showAssetEditor}
          onClose={() => {
            setShowAssetEditor(false);
            setEditingAsset(null);
          }}
          onSave={handleAssetSave}
        />
      </div>
    </div>
  );
}
