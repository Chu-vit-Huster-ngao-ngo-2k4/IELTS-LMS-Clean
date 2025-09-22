'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ProgressDashboard from '@/components/ProgressDashboard'
import DailyDictionary from '@/components/DailyDictionary'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard" showAuth={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Dashboard */}
          <div className="lg:col-span-2">
            <ProgressDashboard />
          </div>
          
          {/* Daily Dictionary */}
          <div className="lg:col-span-1">
            <DailyDictionary />
          </div>
        </div>
      </div>
    </div>
  )
}