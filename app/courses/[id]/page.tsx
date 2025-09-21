'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { BookOpen, Play, Clock, CheckCircle, ArrowRight } from 'lucide-react'

interface Lesson {
  id: number
  title: string
  orderindex: number
  createdat: string
  assets: Asset[]
}

interface Asset {
  id: number
  title: string
  providerkey: string
  mimetype: string
  sizebytes: number
}

interface Course {
  id: number
  title: string
  description: string
  createdat: string
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    // Allow all users to access courses without login
    if (params.id) {
      fetchCourseData()
    }
  }, [params.id])

  const fetchCourseData = async () => {
    try {
      // Fetch course info
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.id)
        .single()

      if (courseError) throw courseError

      // Fetch lessons with assets
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select(`
          *,
          assets(*)
        `)
        .eq('courseid', params.id)
        .order('orderindex')

      if (lessonsError) throw lessonsError

      setCourse(courseData)
      setLessons(lessonsData || [])
    } catch (error) {
      console.error('Error fetching course data:', error)
    } finally {
      setLoadingData(false)
    }
  }


  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khóa học</h3>
          <p className="text-gray-600">Khóa học này không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    )
  }

  const completedLessons = 0 // No progress tracking for now
  const progressPercentage = 0 // No progress tracking for now

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton={true} backUrl="/courses" title="IELTS LMS" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Tiến độ khóa học</span>
              <span className="text-sm text-gray-500">{completedLessons}/{lessons.length} bài học</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {Math.round(progressPercentage)}% hoàn thành
            </p>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Danh sách bài học</h2>
          </div>
          
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài học nào</h3>
              <p className="text-gray-600">Bài học sẽ được thêm vào sớm nhất.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {lesson.progress?.status === 'completed' ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{lesson.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <Play className="h-4 w-4 mr-1" />
                            {lesson.assets?.length || 0} tài liệu
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {lesson.assets?.filter(a => a.mimetype?.startsWith('video')).length > 0 ? 'Video' : 'Audio'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={`/lessons/${lesson.id}`}
                        className="btn-primary text-sm"
                      >
                        Bắt đầu
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
