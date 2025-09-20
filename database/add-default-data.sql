-- ========================================
-- ADD DEFAULT DATA
-- ========================================

-- Add default courses
INSERT INTO public.courses (id, title, description, imageurl, createdat, updatedat) VALUES
    (1, 'Khoá học từ vựng cơ bản', 'Nâng cao vốn từ vựng tiếng Anh của bạn với các bài học cơ bản.', 'https://example.com/vocab.jpg', now(), now()),
    (2, 'Ngữ pháp cơ bản', 'Nắm vững các cấu trúc ngữ pháp thiết yếu để giao tiếp hiệu quả.', 'https://example.com/grammar.jpg', now(), now()),
    (3, 'Phát âm cơ bản', 'Cải thiện phát âm và ngữ điệu tiếng Anh của bạn.', 'https://example.com/pronunciation.jpg', now(), now()),
    (4, 'Hỗ trợ Listening Gap-Filling cơ bản', 'Luyện kỹ năng nghe và điền từ vào chỗ trống.', 'https://example.com/listening.jpg', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Add default lessons for course 1 (Vocabulary)
INSERT INTO public.lessons (id, courseid, title, description, orderindex, createdat, updatedat) VALUES
    (1, 1, 'Section 1 : Thói quen hằng ngày', 'Học từ vựng về các hoạt động hàng ngày.', 1, now(), now()),
    (2, 1, 'Section 2 : Chuyến đi', 'Học từ vựng liên quan đến du lịch và các chuyến đi.', 2, now(), now()),
    (3, 1, 'Section 3 : làm việc nhà', 'Học từ vựng về các công việc nhà.', 3, now(), now()),
    (4, 1, 'Section 4 : các mối quan hệ gia đình', 'Học từ vựng về gia đình và các mối quan hệ.', 4, now(), now()),
    (5, 1, 'Section 5 : Số đếm', 'Học cách đếm và các số cơ bản.', 5, now(), now()),
    (6, 1, 'Section 6 : các tính từ phổ biến', 'Học các tính từ thông dụng.', 6, now(), now()),
    (7, 1, 'Section 7 : Thời tiết', 'Học từ vựng về thời tiết.', 7, now(), now()),
    (8, 1, 'Section 8 : các loại động vật', 'Học từ vựng về các loài động vật.', 8, now(), now()),
    (9, 1, 'Section 9 : Địa điểm', 'Học từ vựng về các địa điểm.', 9, now(), now()),
    (10, 1, 'Bài kiểm tra lần 1', 'Kiểm tra lại các từ vựng đã học.', 10, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Add default lessons for course 2 (Grammar)
INSERT INTO public.lessons (id, courseid, title, description, orderindex, createdat, updatedat) VALUES
    (101, 2, 'Lesson 1: Present Simple', 'Tìm hiểu về thì hiện tại đơn.', 1, now(), now()),
    (102, 2, 'Lesson 2: Present Continuous', 'Tìm hiểu về thì hiện tại tiếp diễn.', 2, now(), now()),
    (103, 2, 'Lesson 3: Past Simple', 'Tìm hiểu về thì quá khứ đơn.', 3, now(), now()),
    (104, 2, 'Lesson 4: Past Continuous', 'Tìm hiểu về thì quá khứ tiếp diễn.', 4, now(), now()),
    (105, 2, 'Lesson 5: Present Perfect', 'Tìm hiểu về thì hiện tại hoàn thành.', 5, now(), now()),
    (106, 2, 'Lesson 6: Future Simple', 'Tìm hiểu về thì tương lai đơn.', 6, now(), now()),
    (107, 2, 'Lesson 7: Articles (a, an, the)', 'Tìm hiểu về mạo từ.', 7, now(), now()),
    (108, 2, 'Lesson 8: Prepositions of Time and Place', 'Tìm hiểu về giới từ chỉ thời gian và nơi chốn.', 8, now(), now()),
    (109, 2, 'Lesson 9: Conditional Sentences Type 1', 'Tìm hiểu về câu điều kiện loại 1.', 9, now(), now()),
    (110, 2, 'Lesson 10: Passive Voice', 'Tìm hiểu về câu bị động.', 10, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Add default lessons for course 3 (Pronunciation)
INSERT INTO public.lessons (id, courseid, title, description, orderindex, createdat, updatedat) VALUES
    (201, 3, 'Lesson 1: IPA Introduction', 'Giới thiệu bảng phiên âm quốc tế IPA.', 1, now(), now()),
    (202, 3, 'Lesson 2: Short Vowels', 'Luyện tập các nguyên âm ngắn.', 2, now(), now()),
    (203, 3, 'Lesson 3: Long Vowels', 'Luyện tập các nguyên âm dài.', 3, now(), now()),
    (204, 3, 'Lesson 4: Diphthongs', 'Luyện tập các nguyên âm đôi.', 4, now(), now()),
    (205, 3, 'Lesson 5: Plosives (p, b, t, d, k, g)', 'Luyện tập các phụ âm bật.', 5, now(), now()),
    (206, 3, 'Lesson 6: Fricatives (f, v, th, s, z, sh, zh, h)', 'Luyện tập các phụ âm xát.', 6, now(), now()),
    (207, 3, 'Lesson 7: Affricates (ch, j)', 'Luyện tập các phụ âm tắc xát.', 7, now(), now()),
    (208, 3, 'Lesson 8: Nasals (m, n, ng)', 'Luyện tập các phụ âm mũi.', 8, now(), now()),
    (209, 3, 'Lesson 9: Liquids (l, r)', 'Luyện tập các phụ âm lỏng.', 9, now(), now()),
    (210, 3, 'Lesson 10: Glides (w, y)', 'Luyện tập các phụ âm lướt.', 10, now(), now()),
    (211, 3, 'Lesson 11: Word Stress', 'Luyện tập trọng âm từ.', 11, now(), now()),
    (212, 3, 'Lesson 12: Sentence Stress and Rhythm', 'Luyện tập trọng âm câu và ngữ điệu.', 12, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Add default lessons for course 4 (Listening Gap-Filling)
INSERT INTO public.lessons (id, courseid, title, description, orderindex, createdat, updatedat) VALUES
    (301, 4, 'Lesson 1: Daily Routines', 'Nghe và điền từ về thói quen hàng ngày.', 1, now(), now()),
    (302, 4, 'Lesson 2: Travel Plans', 'Nghe và điền từ về kế hoạch du lịch.', 2, now(), now()),
    (303, 4, 'Lesson 3: Household Chores', 'Nghe và điền từ về công việc nhà.', 3, now(), now()),
    (304, 4, 'Lesson 4: Family Relationships', 'Nghe và điền từ về các mối quan hệ gia đình.', 4, now(), now()),
    (305, 4, 'Lesson 5: Numbers and Counting', 'Nghe và điền từ về số đếm.', 5, now(), now()),
    (306, 4, 'Lesson 6: Common Adjectives', 'Nghe và điền từ về các tính từ thông dụng.', 6, now(), now()),
    (307, 4, 'Lesson 7: Weather Forecast', 'Nghe và điền từ về dự báo thời tiết.', 7, now(), now()),
    (308, 4, 'Lesson 8: Animal Kingdom', 'Nghe và điền từ về thế giới động vật.', 8, now(), now()),
    (309, 4, 'Lesson 9: Places in the City', 'Nghe và điền từ về các địa điểm trong thành phố.', 9, now(), now()),
    (310, 4, 'Lesson 10: Shopping Experience', 'Nghe và điền từ về trải nghiệm mua sắm.', 10, now(), now()),
    (311, 4, 'Lesson 11: Food and Drinks', 'Nghe và điền từ về đồ ăn và thức uống.', 11, now(), now()),
    (312, 4, 'Lesson 12: Health and Fitness', 'Nghe và điền từ về sức khỏe và thể chất.', 12, now(), now()),
    (313, 4, 'Lesson 13: Education System', 'Nghe và điền từ về hệ thống giáo dục.', 13, now(), now()),
    (314, 4, 'Lesson 14: Technology and Innovation', 'Nghe và điền từ về công nghệ và đổi mới.', 14, now(), now()),
    (315, 4, 'Lesson 15: Environmental Issues', 'Nghe và điền từ về các vấn đề môi trường.', 15, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Check final status
SELECT 'Default data added!' as status;
SELECT COUNT(*) as courses_count FROM public.courses;
SELECT COUNT(*) as lessons_count FROM public.lessons;
SELECT COUNT(*) as assets_count FROM public.assets;
