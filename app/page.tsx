'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import { BookOpen, Play, Users, Award, ArrowRight, Mail, Phone, MessageCircle } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      <Header title="IELTS Learning Management System" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-6 animate-pulse">
            🎯 Hệ thống học IELTS toàn diện
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-medium">
            Từ nền tảng đến chuyên sâu, trang bị đầy đủ kiến thức và kỹ năng để đạt điểm IELTS cao
          </p>
          <div className="flex justify-center space-x-4">
            {user ? (
              <Link
                href="/courses"
                className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Play className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                🚀 Bắt đầu học ngay
              </Link>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Vui lòng đăng nhập để truy cập khóa học</p>
                <Link
                  href="/auth/login"
                  className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 inline-flex items-center font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🔐 Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
            ✨ Tại sao chọn chúng tôi?
          </h2>
          <p className="text-xl text-gray-700 font-medium">
            Hệ thống học IELTS hiện đại với công nghệ tiên tiến
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl p-8 text-center transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-green-200">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">📚 Khóa học đa dạng</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Từ vựng, ngữ pháp, phát âm đến listening gap-filling với nội dung phong phú
            </p>
          </div>

          <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl p-8 text-center transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-emerald-200">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Play className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">🎥 Video chất lượng cao</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Video bài giảng rõ nét, dễ hiểu với hệ thống streaming hiện đại
            </p>
          </div>

          <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl p-8 text-center transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-teal-200">
            <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Award className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">🏆 Theo dõi tiến độ</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Hệ thống theo dõi tiến độ học tập chi tiết và chính xác
            </p>
          </div>
        </div>
      </div>

      {/* Course Preview - Only show if logged in */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
              🌟 Khóa học nổi bật
            </h2>
            <p className="text-xl text-gray-700 font-medium">Bắt đầu hành trình học IELTS của bạn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-green-200">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 h-32 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-900 mb-3">📚 Từ vựng cơ bản</h3>
                <p className="text-gray-600 mb-6 text-sm">Nền tảng từ vựng IELTS vững chắc</p>
                <Link
                  href="/courses/1"
                  className="group/link inline-flex items-center text-green-600 hover:text-green-700 font-bold transition-colors"
                >
                  Xem chi tiết 
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-emerald-200">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 h-32 flex items-center justify-center">
                <Award className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-900 mb-3">📖 Ngữ pháp cơ bản</h3>
                <p className="text-gray-600 mb-6 text-sm">Cấu trúc ngữ pháp quan trọng</p>
                <Link
                  href="/courses/2"
                  className="group/link inline-flex items-center text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
                >
                  Xem chi tiết 
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-teal-200">
              <div className="bg-gradient-to-br from-teal-400 to-cyan-500 h-32 flex items-center justify-center">
                <Play className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-900 mb-3">🎤 Phát âm cơ bản</h3>
                <p className="text-gray-600 mb-6 text-sm">Kỹ thuật phát âm chuẩn</p>
                <Link
                  href="/courses/3"
                  className="group/link inline-flex items-center text-teal-600 hover:text-teal-700 font-bold transition-colors"
                >
                  Xem chi tiết 
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-cyan-200">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 h-32 flex items-center justify-center">
                <Users className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-900 mb-3">🎧 Listening Gap-Filling</h3>
                <p className="text-gray-600 mb-6 text-sm">Kỹ năng nghe và điền từ</p>
                <Link
                  href="/courses/4"
                  className="group/link inline-flex items-center text-cyan-600 hover:text-cyan-700 font-bold transition-colors"
                >
                  Xem chi tiết 
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Admin Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cần thêm khóa học?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bạn muốn thêm khóa học mới hoặc có yêu cầu đặc biệt? 
              Liên hệ với admin để được hỗ trợ!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Email Contact */}
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">Gửi yêu cầu qua email</p>
              <a 
                href="mailto:admin@ielts-lms.com?subject=Yêu cầu thêm khóa học&body=Xin chào admin,%0D%0A%0D%0ATôi muốn thêm khóa học mới với thông tin sau:%0D%0A- Tên khóa học:%0D%0A- Mô tả:%0D%0A- Nội dung:%0D%0A%0D%0ACảm ơn bạn!"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                admin@ielts-lms.com
              </a>
            </div>

            {/* Phone Contact */}
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Điện thoại</h3>
              <p className="text-gray-600 mb-4">Gọi trực tiếp để được tư vấn</p>
              <a 
                href="tel:+84123456789"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                +84 123 456 789
              </a>
            </div>

            {/* Message Contact */}
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tin nhắn</h3>
              <p className="text-gray-600 mb-4">Gửi tin nhắn nhanh</p>
              <a 
                href="https://wa.me/84123456789?text=Xin chào admin, tôi muốn thêm khóa học mới vào hệ thống IELTS LMS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
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
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Image 
            src="/logo2.jpg" 
            alt="IELTS LMS Logo" 
            width={48} 
            height={48} 
            className="mr-3"
          />
          <h3 className="text-xl font-bold">IELTS LMS</h3>
        </div>
            <p className="text-gray-400 mb-4">
              Hệ thống quản lý học tập IELTS toàn diện
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/courses" className="text-gray-400 hover:text-white">
                Khóa học
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}