'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import { BookOpen, Play, Users, Award, ArrowRight, Mail, Phone, MessageCircle } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Header title="IELTS LMS" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Hệ thống học IELTS toàn diện
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
              Từ nền tảng đến chuyên sâu, trang bị đầy đủ kiến thức và kỹ năng để đạt điểm IELTS cao
            </p>
            <div className="flex justify-center space-x-4">
              {user ? (
                <Link
                  href="/courses"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center font-semibold"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Bắt đầu học ngay
                </Link>
              ) : (
                <div className="text-center">
                  <p className="text-blue-100 mb-4">Vui lòng đăng nhập để truy cập khóa học</p>
                  <Link
                    href="/auth/login"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center font-semibold"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hệ thống học IELTS hiện đại với công nghệ tiên tiến
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Khóa học đa dạng</h3>
              <p className="text-gray-600 text-lg">
                Từ vựng, ngữ pháp, phát âm đến listening gap-filling với nội dung phong phú
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Play className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Video chất lượng cao</h3>
              <p className="text-gray-600 text-lg">
                Video bài giảng rõ nét, dễ hiểu với hệ thống streaming hiện đại
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Theo dõi tiến độ</h3>
              <p className="text-gray-600 text-lg">
                Hệ thống theo dõi tiến độ học tập chi tiết và chính xác
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Preview - Only show if logged in */}
      {user && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Khóa học nổi bật</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Bắt đầu hành trình học IELTS của bạn với những khóa học chất lượng cao
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-32 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Từ vựng cơ bản</h3>
                  <p className="text-gray-600 mb-6">Nền tảng từ vựng IELTS vững chắc</p>
                  <Link
                    href="/courses/1"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Xem chi tiết <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="bg-gradient-to-br from-green-500 to-green-600 h-32 flex items-center justify-center">
                  <Award className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Ngữ pháp cơ bản</h3>
                  <p className="text-gray-600 mb-6">Cấu trúc ngữ pháp quan trọng</p>
                  <Link
                    href="/courses/2"
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
                  >
                    Xem chi tiết <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 h-32 flex items-center justify-center">
                  <Play className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Phát âm cơ bản</h3>
                  <p className="text-gray-600 mb-6">Kỹ thuật phát âm chuẩn</p>
                  <Link
                    href="/courses/3"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Xem chi tiết <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 h-32 flex items-center justify-center">
                  <Users className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Listening Gap-Filling</h3>
                  <p className="text-gray-600 mb-6">Kỹ năng nghe và điền từ</p>
                  <Link
                    href="/courses/4"
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    Xem chi tiết <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Admin Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cần thêm khóa học?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bạn muốn thêm khóa học mới hoặc có yêu cầu đặc biệt? 
              Liên hệ với admin để được hỗ trợ ngay!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Email Contact */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Email</h3>
              <p className="text-gray-600 mb-6 text-lg">Gửi yêu cầu qua email</p>
              <a 
                href="mailto:admin@ielts-lms.com?subject=Yêu cầu thêm khóa học&body=Xin chào admin,%0D%0A%0D%0ATôi muốn thêm khóa học mới với thông tin sau:%0D%0A- Tên khóa học:%0D%0A- Mô tả:%0D%0A- Nội dung:%0D%0A%0D%0ACảm ơn bạn!"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg"
              >
                admin@ielts-lms.com
              </a>
            </div>

            {/* Phone Contact */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Điện thoại</h3>
              <p className="text-gray-600 mb-6 text-lg">Gọi trực tiếp để được tư vấn</p>
              <a 
                href="tel:+84123456789"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold text-lg"
              >
                +84 123 456 789
              </a>
            </div>

            {/* Message Contact */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tin nhắn</h3>
              <p className="text-gray-600 mb-6 text-lg">Gửi tin nhắn nhanh</p>
              <a 
                href="https://wa.me/84123456789?text=Xin chào admin, tôi muốn thêm khóa học mới vào hệ thống IELTS LMS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold text-lg"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-gray-50 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Thông tin cần cung cấp khi liên hệ:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin khóa học:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tên khóa học</li>
                    <li>• Mô tả chi tiết</li>
                    <li>• Mức độ (Beginner/Intermediate/Advanced)</li>
                    <li>• Thời lượng dự kiến</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Nội dung khóa học:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Danh sách bài học</li>
                    <li>• Tài liệu (PDF, Video, Audio)</li>
                    <li>• Bài tập và đáp án</li>
                    <li>• Yêu cầu đặc biệt</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Image 
                src="/logo2.jpg" 
                alt="IELTS LMS Logo" 
                width={56} 
                height={56} 
                className="mr-4 rounded-full shadow-lg"
              />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                IELTS LMS
              </h3>
            </div>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Hệ thống quản lý học tập IELTS toàn diện - Nơi bắt đầu hành trình chinh phục IELTS của bạn
            </p>
            <div className="flex justify-center space-x-8 mb-8">
              <Link 
                href="/courses" 
                className="text-gray-300 hover:text-white transition-colors duration-300 font-medium text-lg"
              >
                Khóa học
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-white transition-colors duration-300 font-medium text-lg"
              >
                Dashboard
              </Link>
            </div>
            <div className="border-t border-gray-700 pt-8">
              <p className="text-gray-400 text-sm">
                © 2024 IELTS LMS. Made with ❤️ for IELTS learners.
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}