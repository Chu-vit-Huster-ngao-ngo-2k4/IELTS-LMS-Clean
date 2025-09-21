'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { User, LogOut, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface HeaderProps {
  showBackButton?: boolean
  backUrl?: string
  title?: string
  showAuth?: boolean
}

export default function Header({ 
  showBackButton = false, 
  backUrl = '/', 
  title = 'IELTS LMS',
  showAuth = true 
}: HeaderProps) {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')

    if (!isLogin) {
      if (password !== confirmPassword) {
        setAuthError('Mật khẩu xác nhận không khớp')
        setAuthLoading(false)
        return
      }
      if (password.length < 6) {
        setAuthError('Mật khẩu phải có ít nhất 6 ký tự')
        setAuthLoading(false)
        return
      }
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setShowAuthModal(false)
        router.push('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setAuthSuccess(true)
        setTimeout(() => {
          setShowAuthModal(false)
          setIsLogin(true)
          setAuthSuccess(false)
        }, 2000)
      }
    } catch (err: any) {
      setAuthError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              {showBackButton && (
                <Link href={backUrl} className="mr-6 group">
                  <div className="p-2 rounded-full bg-gray-100 group-hover:bg-green-100 transition-colors duration-300">
                    <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-green-600 transition-colors" />
                  </div>
                </Link>
              )}
              <div className="flex items-center group">
                <div className="relative">
                  <Image 
                    src="/logo2.jpg" 
                    alt="IELTS LMS Logo" 
                    width={56} 
                    height={56} 
                    className="mr-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent group-hover:from-green-600 group-hover:to-purple-600 transition-all duration-300">
                  {title}
                </h1>
              </div>
            </div>
            
            {showAuth && (
              <div className="flex items-center space-x-6">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors duration-300 hover:scale-105 transform"
                >
                  🏠 Trang chủ
                </Link>
                <Link 
                  href="/courses" 
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors duration-300 hover:scale-105 transform"
                >
                  📚 Khóa học
                </Link>
                
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-100 to-green-50 px-4 py-3 rounded-xl border border-gray-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium max-w-32 truncate">{user.email}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      🏠 Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium hover:scale-105 transform"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🚀 Đăng nhập / Đăng ký
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center group">
                  <div className="relative">
                    <Image 
                      src="/logo2.jpg" 
                      alt="IELTS LMS Logo" 
                      width={48} 
                      height={48} 
                      className="mr-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent">
                    {isLogin ? '🔐 Đăng nhập' : '✨ Đăng ký'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl hover:scale-110 transition-transform duration-300"
                >
                  ×
                </button>
              </div>

              {/* Success Message */}
              {authSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-green-600 mr-3">
                      <Image 
                        src="/logo2.jpg" 
                        alt="IELTS LMS Logo" 
                        width={32} 
                        height={32} 
                      />
                    </div>
                    <div>
                      <h3 className="text-green-800 font-medium">Đăng ký thành công!</h3>
                      <p className="text-green-700 text-sm">Vui lòng kiểm tra email để xác thực tài khoản.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập email của bạn"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={isLogin ? 'Nhập mật khẩu' : 'Nhập mật khẩu (ít nhất 6 ký tự)'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập lại mật khẩu"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {authError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {authLoading 
                    ? (isLogin ? 'Đang đăng nhập...' : 'Đang tạo tài khoản...') 
                    : (isLogin ? 'Đăng nhập' : 'Tạo tài khoản')
                  }
                </button>
              </form>

              {/* Toggle between login/register */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setAuthError('');
                      setAuthSuccess(false);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
