'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Play, Clock, CheckCircle, LogOut, User } from 'lucide-react'

interface Course {
  id: number
  title: string
  description: string
  created_at: string
  lessons_count: number
  completed_lessons: number
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchCourses()
    }
  }, [user])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('Courses')
        .select(`
          *,
          Lessons(count),
          Progress!inner(user_id, lesson_id, status)
        `)
        .eq('Progress.user_id', user?.id)

      if (error) throw error

      const coursesWithStats = data?.map(course => ({
        ...course,
        lessons_count: course.Lessons?.[0]?.count || 0,
        completed_lessons: course.Progress?.filter((p: any) => p.status === 'completed').length || 0
      })) || []

      setCourses(coursesWithStats)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoadingCourses(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading || loadingCourses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                IELTS LMS
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/curriculum" 
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
              >
                Lộ trình học
              </Link>
              <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-8 h-8 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
            <h1 className="text-4xl font-bold mb-4">Chào mừng trở lại! 👋</h1>
            <p className="text-xl text-blue-100 mb-6">
              Hãy tiếp tục hành trình học IELTS của bạn với những khóa học chất lượng cao
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/courses" 
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all duration-200 font-medium"
              >
                Xem tất cả khóa học
              </Link>
              <Link 
                href="/curriculum" 
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                Lộ trình học
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Tổng khóa học</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Đang hoạt động
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Bài học hoàn thành</p>
                <p className="text-3xl font-bold text-gray-900">
                  {courses.reduce((sum, course) => sum + course.completed_lessons, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Tuyệt vời!
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Đang học</p>
                <p className="text-3xl font-bold text-gray-900">
                  {courses.reduce((sum, course) => sum + (course.lessons_count - course.completed_lessons), 0)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-yellow-600">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Tiếp tục nào!
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Khóa học của bạn
            </h2>
            <Link 
              href="/courses" 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Xem tất cả
            </Link>
          </div>
          
          {courses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chưa có khóa học nào</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Hãy liên hệ admin để được gán khóa học phù hợp với trình độ của bạn
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/courses" 
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Xem tất cả khóa học
                </Link>
                <Link 
                  href="/" 
                  className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  Liên hệ admin
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed">{course.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                      <span>Tiến độ học tập</span>
                      <span>{course.completed_lessons}/{course.lessons_count} bài</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: course.lessons_count > 0 
                            ? `${(course.completed_lessons / course.lessons_count) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-500 mt-2">
                      {course.lessons_count > 0 
                        ? `${Math.round((course.completed_lessons / course.lessons_count) * 100)}% hoàn thành`
                        : '0% hoàn thành'
                      }
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="bg-green-100 p-1 rounded-full mr-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium">{course.completed_lessons} hoàn thành</span>
                    </div>
                    <Link 
                      href={`/courses/${course.id}`}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                    >
                      Tiếp tục học
                    </Link>
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
