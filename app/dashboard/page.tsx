'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Play, Clock, CheckCircle, LogOut, User, Trophy, Target, TrendingUp, Calendar, Award, Star } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">IELTS LMS</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/curriculum" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium shadow-lg">
                Lộ trình học
              </Link>
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors duration-200 bg-gray-100 hover:bg-red-50 px-3 py-2 rounded-lg"
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
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Chào mừng trở lại! 👋
            </h1>
            <p className="text-lg text-gray-600">Hãy tiếp tục hành trình học IELTS của bạn</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tổng khóa học</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Đang tăng trưởng</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Hoàn thành</p>
                <p className="text-3xl font-bold text-gray-900">
                  {courses.reduce((sum, course) => sum + course.completed_lessons, 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <Trophy className="h-4 w-4 mr-1" />
              <span>Xuất sắc!</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Đang học</p>
                <p className="text-3xl font-bold text-gray-900">
                  {courses.reduce((sum, course) => sum + (course.lessons_count - course.completed_lessons), 0)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-yellow-600">
              <Target className="h-4 w-4 mr-1" />
              <span>Tiếp tục cố gắng</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tỷ lệ hoàn thành</p>
                <p className="text-3xl font-bold text-gray-900">
                  {courses.length > 0 
                    ? Math.round((courses.reduce((sum, course) => sum + course.completed_lessons, 0) / 
                        courses.reduce((sum, course) => sum + course.lessons_count, 0)) * 100) || 0
                    : 0}%
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <Star className="h-4 w-4 mr-1" />
              <span>Tuyệt vời!</span>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Khóa học của bạn
            </h2>
            <Link 
              href="/courses" 
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg"
            >
              Xem tất cả
            </Link>
          </div>
          
          {courses.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-white/20">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Chưa có khóa học nào</h3>
              <p className="text-gray-600 mb-6 text-lg">Hãy liên hệ admin để được gán khóa học phù hợp với bạn.</p>
              <div className="flex justify-center space-x-4">
                <Link href="/courses" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg">
                  Xem tất cả khóa học
                </Link>
                <Link href="/" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium">
                  Liên hệ admin
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Tiến độ</div>
                      <div className="text-lg font-bold text-gray-900">
                        {course.completed_lessons}/{course.lessons_count}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{course.description}</p>
                  
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: course.lessons_count > 0 
                            ? `${(course.completed_lessons / course.lessons_count) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span className="font-medium">{course.completed_lessons} hoàn thành</span>
                    </div>
                    <Link 
                      href={`/courses/${course.id}`}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
                    >
                      Tiếp tục học →
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
