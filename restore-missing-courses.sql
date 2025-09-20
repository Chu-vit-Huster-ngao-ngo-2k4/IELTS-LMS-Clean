-- Khôi phục dữ liệu cho khóa listening và phát âm
-- Kiểm tra courses hiện tại
SELECT id, title FROM public.courses ORDER BY id;

-- Thêm lại courses nếu thiếu
INSERT INTO public.courses (id, title, description, level, levelname, levelorder, createdat) VALUES
(3, 'Phát âm cơ bản', 'Khóa học IELTS Foundation - Pronunciation - Nền Tảng', 'foundation', 'Nền Tảng', 1, '2025-09-19T21:11:35.000Z'),
(4, 'Hỗ trợ Listening Gap-Filling cơ bản', 'Khóa học IELTS Foundation - Listening Gap-Filling - Nền Tảng', 'foundation', 'Nền Tảng', 1, '2025-09-19T21:11:35.000Z')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  level = EXCLUDED.level,
  levelname = EXCLUDED.levelname,
  levelorder = EXCLUDED.levelorder;

-- Thêm lại lessons cho pronunciation (course 3)
INSERT INTO public.lessons (id, courseid, title, description, orderidx, difficulty, createdat) VALUES
(201, 3, 'Section 1: Nguyên âm cơ bản', 'Học cách phát âm các nguyên âm cơ bản trong tiếng Anh', 1, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(202, 3, 'Section 2: Phụ âm cơ bản', 'Học cách phát âm các phụ âm cơ bản', 2, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(203, 3, 'Section 3: Trọng âm từ', 'Học cách đặt trọng âm đúng trong từ', 3, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(204, 3, 'Section 4: Trọng âm câu', 'Học cách đặt trọng âm trong câu', 4, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(205, 3, 'Section 5: Ngữ điệu', 'Học cách sử dụng ngữ điệu trong giao tiếp', 5, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(206, 3, 'Section 6: Luyện tập tổng hợp', 'Luyện tập phát âm tổng hợp', 6, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(207, 3, 'Section 7: Phát âm số và ngày tháng', 'Phát âm số và ngày tháng chính xác', 7, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(208, 3, 'Section 8: Phát âm địa danh', 'Phát âm tên địa danh quốc tế', 8, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(209, 3, 'Section 9: Phát âm tên riêng', 'Phát âm tên riêng người nước ngoài', 9, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(210, 3, 'Section 10: Luyện tập nâng cao', 'Luyện tập phát âm nâng cao', 10, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(211, 3, 'Section 11: Phát âm từ vựng học thuật', 'Phát âm từ vựng học thuật IELTS', 11, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(212, 3, 'Section 12: Luyện tập cuối khóa', 'Luyện tập tổng hợp cuối khóa', 12, 'Cơ bản', '2025-09-19T21:11:35.000Z')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  orderidx = EXCLUDED.orderidx,
  difficulty = EXCLUDED.difficulty;

-- Thêm lại lessons cho listening (course 4)
INSERT INTO public.lessons (id, courseid, title, description, orderidx, difficulty, createdat) VALUES
(301, 4, 'Section 1: Giới thiệu về Gap-Filling', 'Tìm hiểu về dạng bài Gap-Filling trong IELTS Listening', 1, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(302, 4, 'Section 2: Kỹ thuật nghe cơ bản', 'Học các kỹ thuật nghe cơ bản', 2, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(303, 4, 'Section 3: Từ khóa và dấu hiệu', 'Nhận diện từ khóa và dấu hiệu quan trọng', 3, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(304, 4, 'Section 4: Luyện tập với số', 'Luyện tập nghe và điền số', 4, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(305, 4, 'Section 5: Luyện tập với tên', 'Luyện tập nghe và điền tên', 5, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(306, 4, 'Section 6: Luyện tập với địa chỉ', 'Luyện tập nghe và điền địa chỉ', 6, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(307, 4, 'Section 7: Luyện tập với ngày tháng', 'Luyện tập nghe và điền ngày tháng', 7, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(308, 4, 'Section 8: Luyện tập với từ vựng', 'Luyện tập nghe và điền từ vựng', 8, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(309, 4, 'Section 9: Luyện tập với câu', 'Luyện tập nghe và điền câu', 9, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(310, 4, 'Section 10: Luyện tập tổng hợp', 'Luyện tập tổng hợp các dạng bài', 10, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(311, 4, 'Section 11: Luyện tập nâng cao', 'Luyện tập nâng cao với độ khó cao hơn', 11, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(312, 4, 'Section 12: Luyện tập với tốc độ nhanh', 'Luyện tập với tốc độ nói nhanh', 12, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(313, 4, 'Section 13: Luyện tập với giọng khác nhau', 'Luyện tập với các giọng nói khác nhau', 13, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(314, 4, 'Section 14: Luyện tập với nhiễu âm', 'Luyện tập với môi trường có nhiễu âm', 14, 'Cơ bản', '2025-09-19T21:11:35.000Z'),
(315, 4, 'Section 15: Luyện tập cuối khóa', 'Luyện tập tổng hợp cuối khóa', 15, 'Cơ bản', '2025-09-19T21:11:35.000Z')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  orderidx = EXCLUDED.orderidx,
  difficulty = EXCLUDED.difficulty;

-- Kiểm tra kết quả
SELECT 
  c.id as course_id,
  c.title as course_title,
  COUNT(l.id) as lesson_count
FROM public.courses c
LEFT JOIN public.lessons l ON c.id = l.courseid
GROUP BY c.id, c.title
ORDER BY c.id;
