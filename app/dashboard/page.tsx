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
  Info
} from 'lucide-react'

interface Course {
  id: number
  title: string
  description: string
  createdat: string
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
        .from('courses')
        .select(`
          *,
          lessons(count)
        `)
        .order('createdat', { ascending: false })

      if (error) throw error

      const coursesWithStats = data?.map(course => ({
        ...course,
        lessons_count: course.lessons?.[0]?.count || 0,
        completed_lessons: 0 // No progress tracking for now
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
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
              <Link href="/dashboard" className="flex items-center p-3 rounded-lg bg-red-700 text-white">
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
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học, bài học..."
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Banner */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Khám phá ngay AI Chat mới của IELTS LMS</h2>
                  <p className="text-purple-100 mb-4">
                    Trò chuyện, Hỏi đáp, Học tập - AI ở đây để làm cho việc học IELTS của bạn dễ dàng và hiệu quả hơn.
                  </p>
                  <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                    Tìm hiểu thêm!
                  </button>
                </div>
                <div className="absolute right-0 top-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute right-8 top-4 w-24 h-24 bg-white bg-opacity-5 rounded-full"></div>
              </div>

              {/* Progress Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiến độ học tập</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">01 Từ vựng cơ bản</span>
                      <span className="text-sm text-gray-500">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">02 Ngữ pháp cơ bản</span>
                      <span className="text-sm text-gray-500">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Hiệu suất</h3>
                  <Info className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex items-center">
                  <div className="w-24 h-24 relative">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#f97316"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40 * 0.68} ${2 * Math.PI * 40}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">68%</span>
                    </div>
                  </div>
                  <div className="ml-6 space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Nội dung đã hoàn thành</span>
                      <span className="font-semibold text-gray-900 ml-2">7 Bài học</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Nội dung còn lại</span>
                      <span className="font-semibold text-gray-900 ml-2">3 Bài học</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Đang chờ</span>
                      <span className="font-semibold text-gray-900 ml-2">0 Bài học</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* User Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-red-600 font-bold text-lg">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.email?.split('@')[0]}</p>
                    <p className="text-sm text-gray-500">IELTS Student</p>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tháng 12, 2024</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  <div className="p-2 text-gray-500">T2</div>
                  <div className="p-2 text-gray-500">T3</div>
                  <div className="p-2 text-gray-500">T4</div>
                  <div className="p-2 text-gray-500">T5</div>
                  <div className="p-2 text-gray-500">T6</div>
                  <div className="p-2 text-gray-500">T7</div>
                  <div className="p-2 text-gray-500">CN</div>
                  <div className="p-2 text-gray-400">25</div>
                  <div className="p-2 text-gray-400">26</div>
                  <div className="p-2 text-gray-400">27</div>
                  <div className="p-2 text-gray-400">28</div>
                  <div className="p-2 text-gray-400">29</div>
                  <div className="p-2 text-gray-400">30</div>
                  <div className="p-2 text-gray-400">1</div>
                  <div className="p-2 text-gray-400">2</div>
                  <div className="p-2 text-gray-400">3</div>
                  <div className="p-2 text-gray-400">4</div>
                  <div className="p-2 text-gray-400">5</div>
                  <div className="p-2 text-gray-400">6</div>
                  <div className="p-2 text-gray-400">7</div>
                  <div className="p-2 text-gray-400">8</div>
                  <div className="p-2 text-gray-400">9</div>
                  <div className="p-2 text-gray-400">10</div>
                  <div className="p-2 text-gray-400">11</div>
                  <div className="p-2 text-gray-400">12</div>
                  <div className="p-2 text-gray-400">13</div>
                  <div className="p-2 text-gray-400">14</div>
                  <div className="p-2 text-gray-400">15</div>
                  <div className="p-2 text-gray-400">16</div>
                  <div className="p-2 text-gray-400">17</div>
                  <div className="p-2 text-gray-400">18</div>
                  <div className="p-2 text-gray-400">19</div>
                  <div className="p-2 text-gray-400">20</div>
                  <div className="p-2 text-gray-400">21</div>
                  <div className="p-2 text-gray-400">22</div>
                  <div className="p-2 text-gray-400">23</div>
                  <div className="p-2 text-gray-400">24</div>
                  <div className="p-2 text-gray-400">25</div>
                  <div className="p-2 text-gray-400">26</div>
                  <div className="p-2 text-gray-400">27</div>
                  <div className="p-2 text-gray-400">28</div>
                  <div className="p-2 text-gray-400">29</div>
                  <div className="p-2 text-gray-400">30</div>
                  <div className="p-2 text-gray-400">31</div>
                </div>
                <button className="w-full mt-4 text-sm text-red-600 hover:text-red-700 font-medium">
                  Xem thêm
                </button>
              </div>

              {/* Course Cards */}
              <div className="space-y-4">
                <div className="bg-blue-500 rounded-xl p-4 text-white">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center mr-3">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">Từ vựng cơ bản</span>
                  </div>
                </div>
                <div className="bg-red-500 rounded-xl p-4 text-white">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-400 rounded-lg flex items-center justify-center mr-3">
                      <Monitor className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">Listening Practice</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Classes */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lớp học sắp tới</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">3 Lớp học trực tuyến</p>
                      <p className="text-xs text-gray-500">3/12 - 9:00h</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">7 Lớp ôn tập</p>
                      <p className="text-xs text-gray-500">7/12 - 11:00h</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">11 Lớp chữa bài</p>
                      <p className="text-xs text-gray-500">11/12 - 14:00h</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <button className="w-full mt-4 text-sm text-red-600 hover:text-red-700 font-medium">
                  Xem thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}