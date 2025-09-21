'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
  Users
} from 'lucide-react'

interface Course {
  id: number
  title: string
  description: string
  createdat: string
  lessons_count: number
}

export default function CoursesPage() {
  const { user, loading } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          lessons(count)
        `)
        .order('createdat', { ascending: false })

      if (error) throw error

      const coursesWithStats = data?.map(course => ({
        ...course,
        lessons_count: course.lessons?.[0]?.count || 0
      })) || []

      setCourses(coursesWithStats)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoadingCourses(false)
    }
  }

  if (loadingCourses) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    )
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
          {user ? (
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
          ) : (
            <div className="text-center">
              <Link
                href="/auth/login"
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tất cả khóa học</h1>
            <p className="text-gray-600">Khám phá các khóa học IELTS chất lượng cao</p>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-32 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {course.lessons_count} bài học
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      ~{Math.ceil(course.lessons_count * 0.5)}h
                    </div>
                  </div>

                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center group-hover:scale-105 transform"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Bắt đầu học
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có khóa học nào</h3>
              <p className="text-gray-600 mb-6">Các khóa học sẽ được thêm vào sớm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}