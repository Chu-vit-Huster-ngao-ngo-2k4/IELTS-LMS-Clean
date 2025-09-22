'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import DailyDictionary from '@/components/DailyDictionary';
import { useAuth } from '@/components/AuthProvider';
import { BookOpen, Play, Users, Award, ArrowRight, Mail, Phone, MessageCircle } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header title="IELTS Learning Management System" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Hệ thống học IELTS toàn diện
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Từ nền tảng đến chuyên sâu, trang bị đầy đủ kiến thức và kỹ năng để đạt điểm IELTS cao
          </p>
          <div className="flex justify-center space-x-4">
            {user ? (
              <Link
                href="/courses"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Play className="h-5 w-5 mr-2" />
                Bắt đầu học ngay
              </Link>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Vui lòng đăng nhập để truy cập khóa học</p>
                <Link
                  href="/auth/login"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Khóa học đa dạng</h3>
            <p className="text-gray-600">
              Từ vựng, ngữ pháp, phát âm đến listening gap-filling
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Video chất lượng cao</h3>
            <p className="text-gray-600">
              Video bài giảng rõ nét, dễ hiểu với hệ thống streaming hiện đại
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Theo dõi tiến độ</h3>
            <p className="text-gray-600">
              Hệ thống theo dõi tiến độ học tập chi tiết và chính xác
            </p>
          </div>
        </div>
      </div>

      {/* Daily Dictionary - Show for all users */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Từ vựng IELTS hôm nay</h2>
          <p className="text-gray-600">Học từ vựng mới mỗi ngày để nâng cao trình độ IELTS</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <DailyDictionary />
        </div>
      </div>

      {/* Course Preview - Only show if logged in */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Khóa học nổi bật</h2>
            <p className="text-gray-600">Bắt đầu hành trình học IELTS của bạn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Từ vựng cơ bản</h3>
                <p className="text-gray-600 text-sm mb-4">Nền tảng từ vựng IELTS</p>
                <Link
                  href="/courses/1"
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  Xem chi tiết <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ngữ pháp cơ bản</h3>
                <p className="text-gray-600 text-sm mb-4">Cấu trúc ngữ pháp quan trọng</p>
                <Link
                  href="/courses/2"
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  Xem chi tiết <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phát âm cơ bản</h3>
                <p className="text-gray-600 text-sm mb-4">Kỹ thuật phát âm chuẩn</p>
                <Link
                  href="/courses/3"
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  Xem chi tiết <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Listening Gap-Filling</h3>
                <p className="text-gray-600 text-sm mb-4">Kỹ năng nghe và điền từ</p>
                <Link
                  href="/courses/4"
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  Xem chi tiết <ArrowRight className="h-4 w-4 ml-1" />
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