'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Download, FileText } from 'lucide-react';
import AudioPlayerWrapper from './AudioPlayerWrapper';
import { Asset } from '@/lib/types';

interface ListeningLessonViewerProps {
  audios: Asset[];
  exercises: Asset[];
  answers: Asset[];
  onComplete?: () => void;
}

export default function ListeningLessonViewer({ 
  audios, 
  exercises, 
  answers,
  onComplete 
}: ListeningLessonViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [signedUrls, setSignedUrls] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<{ [key: string]: boolean }>({});

  // Separate handouts and answers
  const handouts = exercises.filter(ex => ex.title.includes('handout'));
  // answers are now passed as props, no need to filter from exercises

  useEffect(() => {
    getSignedUrls();
  }, [exercises, answers]);

  const getSignedUrls = async () => {
    try {
      setLoading(true);
      const allAssets = [...handouts, ...answers];
      const urlPromises = allAssets.map(async (asset) => {
        const response = await fetch('/api/r2-sign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: asset.providerkey,
            filename: asset.title
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to get signed URL for ${asset.title}`);
        }

        const data = await response.json();
        return { id: asset.id, url: data.signedUrl };
      });

      const results = await Promise.all(urlPromises);
      const urlMap = results.reduce((acc, { id, url }) => {
        acc[id] = url;
        return acc;
      }, {} as { [key: string]: string });

      setSignedUrls(urlMap);
    } catch (err) {
      console.error('Error getting signed URLs:', err);
      setError('Không thể tải bài tập');
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < handouts.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const downloadAnswer = async (answer: Asset) => {
    try {
      setDownloading(prev => ({ ...prev, [answer.id]: true }));
      
      // Get signed URL for download
      const response = await fetch('/api/r2-sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: answer.providerkey,
          filename: answer.title
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get download URL for ${answer.title}`);
      }

      const data = await response.json();
      
      // Create download link
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = `${answer.title}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error('Error downloading answer:', err);
      alert('Không thể tải file đáp án. Vui lòng thử lại.');
    } finally {
      setDownloading(prev => ({ ...prev, [answer.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải bài học...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={getSignedUrls}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const currentHandout = handouts[currentPage];
  const currentAnswer = answers[currentPage];
  const handoutUrl = currentHandout ? signedUrls[currentHandout.id] : null;
  const answerUrl = currentAnswer ? signedUrls[currentAnswer.id] : null;

  return (
    <div className="space-y-6">
      {/* Audio Section - Only show current page audio */}
      {audios.length > 0 && currentPage < handouts.length && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🎧 Audio Listening - Part {currentPage + 1}
          </h2>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">
                {audios[currentPage]?.title || `Part ${currentPage + 1}`}
              </h3>
              <span className="text-sm text-gray-500">
                {audios[currentPage] ? Math.round(audios[currentPage].sizebytes / 1024 / 1024 * 100) / 100 : 0} MB
              </span>
            </div>
            <AudioPlayerWrapper
              audio={audios[currentPage]}
              onProgress={(progress) => {
                console.log(`Audio Part ${currentPage + 1} progress: ${progress}%`);
              }}
            />
          </div>
        </div>
      )}

      {/* PDF Viewer Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            📄 Bài Tập - Trang {currentPage + 1} / {handouts.length + 1}
          </h2>
          
          <div className="flex items-center space-x-4">
            {/* Download Answers Button */}
            {answers.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    // Download all answers
                    answers.forEach(answer => downloadAnswer(answer));
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải tất cả đáp án
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-600 min-w-[100px] text-center">
                {currentPage + 1} / {handouts.length + 1}
              </span>
              
              <button
                onClick={nextPage}
                disabled={currentPage >= handouts.length}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* PDF Content */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {currentPage < handouts.length ? (
            // Show handout page
            <div>
              <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-blue-900">
                    📝 Bài tập - Part {currentPage + 1}
                  </h3>
                  {answers[currentPage] && (
                    <button
                      onClick={() => downloadAnswer(answers[currentPage])}
                      disabled={downloading[answers[currentPage].id]}
                      className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {downloading[answers[currentPage].id] ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          Đang tải...
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3 mr-1" />
                          Tải đáp án
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              {handoutUrl ? (
                <iframe
                  src={handoutUrl}
                  className="w-full h-[600px]"
                  title={`Bài tập Part ${currentPage + 1}`}
                />
              ) : (
                <div className="h-[600px] flex items-center justify-center bg-gray-50">
                  <p className="text-gray-500">Đang tải bài tập...</p>
                </div>
              )}
            </div>
          ) : (
            // Show answers page (no audio on this page)
            <div>
              <div className="bg-green-50 px-4 py-2 border-b border-gray-200">
                <h3 className="font-medium text-green-900">
                  ✅ Đáp án - Tất cả các phần
                </h3>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <FileText className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Tải file đáp án về máy
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Nhấn vào nút bên dưới để tải tất cả file đáp án về máy tính của bạn
                  </p>
                </div>
                
                <div className="space-y-4">
                  {answers.map((answer, index) => (
                    <div key={answer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Đáp án Part {index + 1}
                          </h5>
                          <p className="text-sm text-gray-500">
                            {answer.title} • {(answer.sizebytes / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadAnswer(answer)}
                        disabled={downloading[answer.id]}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {downloading[answer.id] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Đang tải...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Tải về
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      // Download all answers at once
                      answers.forEach(answer => downloadAnswer(answer));
                    }}
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Tải tất cả đáp án ({answers.length} files)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Tiến độ</span>
            <span>{Math.round(((currentPage + 1) / (handouts.length + 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentPage + 1) / (handouts.length + 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Complete Button */}
        {currentPage >= handouts.length && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onComplete}
              className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Hoàn thành bài học
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
