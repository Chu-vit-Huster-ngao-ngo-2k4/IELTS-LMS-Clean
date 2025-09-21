-- ========================================
-- ADD PRONUNCIATION ASSETS
-- ========================================

-- Add pronunciation assets for Course 3 (Pronunciation)
-- Each lesson will have: 1 video, 1 audio, 1 exercise PDF, 1 answer DOCX

-- Lesson 201: IPA Introduction
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (201, 'IPA Introduction Video', 'Video giới thiệu bảng phiên âm quốc tế', 'video', 'video/mp4', 'pronunciation/lesson-1/video.mp4', 15728640, now(), now()),
    (201, 'IPA Introduction Audio', 'Audio luyện tập phát âm IPA', 'audio', 'audio/mp3', 'pronunciation/lesson-1/audio.mp3', 3145728, now(), now()),
    (201, 'IPA Introduction Exercise', 'Bài tập luyện phát âm IPA', 'document', 'application/pdf', 'pronunciation/lesson-1/exercise.pdf', 1048576, now(), now()),
    (201, 'IPA Introduction Answer', 'Đáp án bài tập IPA', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/lesson-1/answer.docx', 512000, now(), now());

-- Lesson 202: Common Pronunciation Errors
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (202, 'Common Errors Video', 'Video về các lỗi phát âm thường gặp', 'video', 'video/mp4', 'pronunciation/lesson-2/video.mp4', 16777216, now(), now()),
    (202, 'Common Errors Audio', 'Audio luyện tập sửa lỗi phát âm', 'audio', 'audio/mp3', 'pronunciation/lesson-2/audio.mp3', 4194304, now(), now()),
    (202, 'Common Errors Exercise', 'Bài tập sửa lỗi phát âm', 'document', 'application/pdf', 'pronunciation/lesson-2/exercise.pdf', 1310720, now(), now()),
    (202, 'Common Errors Answer', 'Đáp án bài tập sửa lỗi', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/lesson-2/answer.docx', 655360, now(), now());

-- Lesson 203: Short Vowels
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (203, 'Short Vowels Video', 'Video luyện tập nguyên âm ngắn', 'video', 'video/mp4', 'pronunciation/lesson-3/video.mp4', 14680064, now(), now()),
    (203, 'Short Vowels Audio', 'Audio luyện tập nguyên âm ngắn', 'audio', 'audio/mp3', 'pronunciation/lesson-3/audio.mp3', 3670016, now(), now()),
    (203, 'Short Vowels Exercise', 'Bài tập nguyên âm ngắn', 'document', 'application/pdf', 'pronunciation/lesson-3/exercise.pdf', 1179648, now(), now()),
    (203, 'Short Vowels Answer', 'Đáp án bài tập nguyên âm ngắn', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/lesson-3/answer.docx', 589824, now(), now());

-- Lesson 204: Long Vowels
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (204, 'Long Vowels Video', 'Video luyện tập nguyên âm dài', 'video', 'video/mp4', 'pronunciation/lesson-4/video.mp4', 15204352, now(), now()),
    (204, 'Long Vowels Audio', 'Audio luyện tập nguyên âm dài', 'audio', 'audio/mp3', 'pronunciation/lesson-4/audio.mp3', 3801088, now(), now()),
    (204, 'Long Vowels Exercise', 'Bài tập nguyên âm dài', 'document', 'application/pdf', 'pronunciation/lesson-4/exercise.pdf', 1228800, now(), now()),
    (204, 'Long Vowels Answer', 'Đáp án bài tập nguyên âm dài', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/lesson-4/answer.docx', 614400, now(), now());

-- Lesson 205: Diphthongs
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (205, 'Diphthongs Video', 'Video luyện tập nguyên âm đôi', 'video', 'video/mp4', 'pronunciation/lesson-5/video.mp4', 16121856, now(), now()),
    (205, 'Diphthongs Audio', 'Audio luyện tập nguyên âm đôi', 'audio', 'audio/mp3', 'pronunciation/lesson-5/audio.mp3', 4030464, now(), now()),
    (205, 'Diphthongs Exercise', 'Bài tập nguyên âm đôi', 'document', 'application/pdf', 'pronunciation/lesson-5/exercise.pdf', 1310720, now(), now()),
    (205, 'Diphthongs Answer', 'Đáp án bài tập nguyên âm đôi', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/lesson-5/answer.docx', 655360, now(), now());

-- Lesson 206: Vowel Diphthongs
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (206, 'Vowel Diphthongs Video', 'Video luyện tập nguyên âm đôi nâng cao', 'video', 'video/mp4', 'pronunciation/lesson-6/video.mp4', 17039360, now(), now()),
    (206, 'Vowel Diphthongs Audio', 'Audio luyện tập nguyên âm đôi nâng cao', 'audio', 'audio/mp3', 'pronunciation/lesson-6/audio.mp3', 4259840, now(), now()),
    (206, 'Vowel Diphthongs Exercise', 'Bài tập nguyên âm đôi nâng cao', 'document', 'application/pdf', 'pronunciation/lesson-6/exercise.pdf', 1376256, now(), now()),
    (206, 'Vowel Diphthongs Answer', 'Đáp án bài tập nguyên âm đôi nâng cao', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/lesson-6/answer.docx', 688128, now(), now());

-- Lesson 207: Vowel Summary
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (207, 'Vowel Summary Video', 'Video tổng kết âm nguyên âm', 'video', 'video/mp4', 'pronunciation/lesson-7/video.mp4', 18350080, now(), now()),
    (207, 'Vowel Summary Audio', 'Audio tổng kết âm nguyên âm', 'audio', 'audio/mp3', 'pronunciation/lesson-7/audio.mp3', 4587520, now(), now()),
    (207, 'Vowel Summary Exercise', 'Bài tập tổng kết âm nguyên âm', 'document', 'application/pdf', 'pronunciation/lesson-7/exercise.pdf', 1572864, now(), now()),
    (207, 'Vowel Summary Answer', 'Đáp án bài tập tổng kết âm nguyên âm', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/lesson-7/answer.docx', 786432, now(), now());

-- Lesson 208: Plosives
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (208, 'Plosives Video', 'Video luyện tập phụ âm bật', 'video', 'video/mp4', 'pronunciation/lesson-8/video.mp4', 16777216, now(), now()),
    (208, 'Plosives Audio', 'Audio luyện tập phụ âm bật', 'audio', 'audio/mp3', 'pronunciation/lesson-8/audio.mp3', 4194304, now(), now()),
    (208, 'Plosives Exercise', 'Bài tập phụ âm bật', 'document', 'application/pdf', 'pronunciation/lesson-8/exercise.pdf', 1310720, now(), now()),
    (208, 'Plosives Answer', 'Đáp án bài tập phụ âm bật', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/lesson-8/answer.docx', 655360, now(), now());

-- Lesson 209: Nasals
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (209, 'Nasals Video', 'Video luyện tập phụ âm mũi', 'video', 'video/mp4', 'pronunciation/lesson-9/video.mp4', 15728640, now(), now()),
    (209, 'Nasals Audio', 'Audio luyện tập phụ âm mũi', 'audio', 'audio/mp3', 'pronunciation/lesson-9/audio.mp3', 3932160, now(), now()),
    (209, 'Nasals Exercise', 'Bài tập phụ âm mũi', 'document', 'application/pdf', 'pronunciation/lesson-9/exercise.pdf', 1179648, now(), now()),
    (209, 'Nasals Answer', 'Đáp án bài tập phụ âm mũi', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/lesson-9/answer.docx', 589824, now(), now());

-- Lesson 210: Fricatives
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (210, 'Fricatives Video', 'Video luyện tập phụ âm xát', 'video', 'video/mp4', 'pronunciation/lesson-10/video.mp4', 17825792, now(), now()),
    (210, 'Fricatives Audio', 'Audio luyện tập phụ âm xát', 'audio', 'audio/mp3', 'pronunciation/lesson-10/audio.mp3', 4456448, now(), now()),
    (210, 'Fricatives Exercise', 'Bài tập phụ âm xát', 'document', 'application/pdf', 'pronunciation/lesson-10/exercise.pdf', 1441792, now(), now()),
    (210, 'Fricatives Answer', 'Đáp án bài tập phụ âm xát', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/lesson-10/answer.docx', 720896, now(), now());

-- Lesson 211: Final Sounds
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (211, 'Final Sounds Video', 'Video luyện tập âm cuối', 'video', 'video/mp4', 'pronunciation/lesson-11/video.mp4', 15204352, now(), now()),
    (211, 'Final Sounds Audio', 'Audio luyện tập âm cuối', 'audio', 'audio/mp3', 'pronunciation/lesson-11/audio.mp3', 3801088, now(), now()),
    (211, 'Final Sounds Exercise', 'Bài tập âm cuối', 'document', 'application/pdf', 'pronunciation/lesson-11/exercise.pdf', 1228800, now(), now()),
    (211, 'Final Sounds Answer', 'Đáp án bài tập âm cuối', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/lesson-11/answer.docx', 614400, now(), now());

-- Lesson 212: Word Stress
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (212, 'Word Stress Video', 'Video luyện tập trọng âm từ', 'video', 'video/mp4', 'pronunciation/lesson-12/video.mp4', 16121856, now(), now()),
    (212, 'Word Stress Audio', 'Audio luyện tập trọng âm từ', 'audio', 'audio/mp3', 'pronunciation/lesson-12/audio.mp3', 4030464, now(), now()),
    (212, 'Word Stress Exercise', 'Bài tập trọng âm từ', 'document', 'application/pdf', 'pronunciation/lesson-12/exercise.pdf', 1310720, now(), now()),
    (212, 'Word Stress Answer', 'Đáp án bài tập trọng âm từ', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/lesson-12/answer.docx', 655360, now(), now());

-- Minitest 1 (Lesson 213)
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (213, 'Minitest 1 Video', 'Video hướng dẫn bài kiểm tra nhỏ 1', 'video', 'video/mp4', 'pronunciation/minitest-1/video.mp4', 12582912, now(), now()),
    (213, 'Minitest 1 Audio', 'Audio bài kiểm tra nhỏ 1', 'audio', 'audio/mp3', 'pronunciation/minitest-1/audio.mp3', 3145728, now(), now()),
    (213, 'Minitest 1 Exercise', 'Bài kiểm tra nhỏ 1', 'document', 'application/pdf', 'pronunciation/minitest-1/exercise.pdf', 1048576, now(), now()),
    (213, 'Minitest 1 Answer', 'Đáp án bài kiểm tra nhỏ 1', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/minitest-1/answer.docx', 524288, now(), now());

-- Minitest 2 (Lesson 214)
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (214, 'Minitest 2 Video', 'Video hướng dẫn bài kiểm tra nhỏ 2', 'video', 'video/mp4', 'pronunciation/minitest-2/video.mp4', 13107200, now(), now()),
    (214, 'Minitest 2 Audio', 'Audio bài kiểm tra nhỏ 2', 'audio', 'audio/mp3', 'pronunciation/minitest-2/audio.mp3', 3276800, now(), now()),
    (214, 'Minitest 2 Exercise', 'Bài kiểm tra nhỏ 2', 'document', 'application/pdf', 'pronunciation/minitest-2/exercise.pdf', 1179648, now(), now()),
    (214, 'Minitest 2 Answer', 'Đáp án bài kiểm tra nhỏ 2', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/minitest-2/answer.docx', 589824, now(), now());

-- Minitest 3 (Lesson 215)
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (215, 'Minitest 3 Video', 'Video hướng dẫn bài kiểm tra nhỏ 3', 'video', 'video/mp4', 'pronunciation/minitest-3/video.mp4', 13631488, now(), now()),
    (215, 'Minitest 3 Audio', 'Audio bài kiểm tra nhỏ 3', 'audio', 'audio/mp3', 'pronunciation/minitest-3/audio.mp3', 3407872, now(), now()),
    (215, 'Minitest 3 Exercise', 'Bài kiểm tra nhỏ 3', 'document', 'application/pdf', 'pronunciation/minitest-3/exercise.pdf', 1310720, now(), now()),
    (215, 'Minitest 3 Answer', 'Đáp án bài kiểm tra nhỏ 3', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/minitest-3/answer.docx', 655360, now(), now());

-- Minitest 4 (Lesson 216)
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (216, 'Minitest 4 Video', 'Video hướng dẫn bài kiểm tra nhỏ 4', 'video', 'video/mp4', 'pronunciation/minitest-4/video.mp4', 14155776, now(), now()),
    (216, 'Minitest 4 Audio', 'Audio bài kiểm tra nhỏ 4', 'audio', 'audio/mp3', 'pronunciation/minitest-4/audio.mp3', 3538944, now(), now()),
    (216, 'Minitest 4 Exercise', 'Bài kiểm tra nhỏ 4', 'document', 'application/pdf', 'pronunciation/minitest-4/exercise.pdf', 1441792, now(), now()),
    (216, 'Minitest 4 Answer', 'Đáp án bài kiểm tra nhỏ 4', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/minitest-4/answer.docx', 720896, now(), now());

-- Minitest 5 (Lesson 217)
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (217, 'Minitest 5 Video', 'Video hướng dẫn bài kiểm tra nhỏ 5', 'video', 'video/mp4', 'pronunciation/minitest-5/video.mp4', 14680064, now(), now()),
    (217, 'Minitest 5 Audio', 'Audio bài kiểm tra nhỏ 5', 'audio', 'audio/mp3', 'pronunciation/minitest-5/audio.mp3', 3670016, now(), now()),
    (217, 'Minitest 5 Exercise', 'Bài kiểm tra nhỏ 5', 'document', 'application/pdf', 'pronunciation/minitest-5/exercise.pdf', 1572864, now(), now()),
    (217, 'Minitest 5 Answer', 'Đáp án bài kiểm tra nhỏ 5', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/minitest-5/answer.docx', 786432, now(), now());

-- Final Test (Lesson 218)
INSERT INTO public.assets (lessonid, title, description, assettype, mimetype, providerkey, sizebytes, createdat, updatedat) VALUES
    (218, 'Final Test Video', 'Video hướng dẫn bài kiểm tra cuối khóa', 'video', 'video/mp4', 'pronunciation/final-test/video.mp4', 20971520, now(), now()),
    (218, 'Final Test Audio', 'Audio bài kiểm tra cuối khóa', 'audio', 'audio/mp3', 'pronunciation/final-test/audio.mp3', 5242880, now(), now()),
    (218, 'Final Test Exercise', 'Bài kiểm tra cuối khóa', 'document', 'application/pdf', 'pronunciation/final-test/exercise.pdf', 2097152, now(), now()),
    (218, 'Final Test Answer', 'Đáp án bài kiểm tra cuối khóa', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pronunciation/final-test/answer.docx', 1048576, now(), now());

SELECT 'Pronunciation assets added successfully!' as status;
