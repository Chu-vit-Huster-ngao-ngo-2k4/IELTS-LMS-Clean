'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/AuthProvider'
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
} from 'lucide-react'

interface Course {
  id: number
  title: string
  description: string
  createdat: string
}

interface Lesson {
  id: number
  title: string
  description: string
  orderindex: number
  courseid: number
  assets: Asset[]
}

interface Asset {
  id: number
  title: string
  mimetype: string
  sizebytes: number
  providerkey: string
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user, loading: authLoading } = useAuth()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (params.id && user) {
      fetchCourseData()
    }
  }, [params.id, user])

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

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy khóa học</h1>
          <Link href="/courses" className="text-red-600 hover:text-red-700">
            Quay lại danh sách khóa học
          </Link>
        </div>
      </div>
    )
  }

  const completedLessons = 0 // No progress tracking for now
  const progressPercentage = 0 // No progress tracking for now

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
              <Link href="/courses" className="flex items-center p-3 rounded-lg bg-red-700 text-white">
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
              <Link href="/lessons" className="flex items-center p-3 rounded-lg text-red-100 hover:bg-red-700 hover:text-white transition-colors">
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
              <Link href="/courses" className="mr-4 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài học..."
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
          {/* Course Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{course.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {lessons.length} bài học
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    ~{Math.ceil(lessons.length * 0.5)} giờ
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {completedLessons} đã hoàn thành
                  </div>
                </div>
              </div>
              
              <div className="ml-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-24 h-24 rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Tiến độ khóa học</h2>
              <span className="text-sm text-gray-500">{progressPercentage}% hoàn thành</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Danh sách bài học</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                        </div>
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
                            ~{Math.ceil((lesson.assets?.length || 0) * 0.2)} phút
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/lessons/${lesson.id}`}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Bắt đầu
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {lessons.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có bài học nào</h3>
              <p className="text-gray-600">Các bài học sẽ được thêm vào sớm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}