'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useUserActivity } from '@/hooks/useUserActivity'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { BookOpen, Play, Clock } from 'lucide-react'

interface Course {
  id: number
  title: string
  description: string
  created_at: string
  lessons_count: number
}

export default function CoursesPage() {
  const { user, loading } = useAuth()
  const { logActivity } = useUserActivity()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    // Allow all users to access courses without login
    fetchCourses()
    
    // Log page visit
    if (user) {
      logActivity('visited_courses_page', 'page', 'courses')
    }
  }, [user, logActivity])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton={true} backUrl="/" title="IELTS LMS" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tất cả khóa học</h1>
          <p className="mt-2 text-gray-600">Chọn khóa học để bắt đầu học tập</p>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học nào</h3>
            <p className="text-gray-600">Khóa học sẽ được thêm vào sớm nhất.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="card hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Play className="h-4 w-4 mr-2" />
                    {course.lessons_count} bài học
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    Tạo ngày {new Date(course.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>

                <Link 
                  href={`/courses/${course.id}`}
                  className="btn-primary w-full text-center block"
                >
                  Xem khóa học
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
