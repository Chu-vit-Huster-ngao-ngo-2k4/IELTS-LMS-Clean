-- ========================================
-- SETUP PRONUNCIATION COMPLETE
-- ========================================

-- Step 1: Add pronunciation lessons
INSERT INTO public.lessons (id, courseid, title, description, orderindex, createdat, updatedat) VALUES
    (201, 3, 'Lesson 1: IPA Introduction', 'Giới thiệu bảng phiên âm quốc tế IPA.', 1, now(), now()),
    (202, 3, 'Lesson 2: Common Pronunciation Errors', 'Các lỗi phát âm thường gặp.', 2, now(), now()),
    (203, 3, 'Lesson 3: Short Vowels', 'Luyện tập các nguyên âm ngắn.', 3, now(), now()),
    (204, 3, 'Lesson 4: Long Vowels', 'Luyện tập các nguyên âm dài.', 4, now(), now()),
    (205, 3, 'Lesson 5: Diphthongs', 'Luyện tập các nguyên âm đôi.', 5, now(), now()),
    (206, 3, 'Lesson 6: Vowel Diphthongs', 'Luyện tập các nguyên âm đôi nâng cao.', 6, now(), now()),
    (207, 3, 'Lesson 7: Vowel Summary', 'Tổng kết âm nguyên âm.', 7, now(), now()),
    (208, 3, 'Lesson 8: Plosives (p, b, t, d, k, g)', 'Luyện tập các phụ âm bật.', 8, now(), now()),
    (209, 3, 'Lesson 9: Nasals (m, n, ng)', 'Luyện tập các phụ âm mũi.', 9, now(), now()),
    (210, 3, 'Lesson 10: Fricatives (f, v, th, s, z, sh, zh, h)', 'Luyện tập các phụ âm xát.', 10, now(), now()),
    (211, 3, 'Lesson 11: Final Sounds', 'Luyện tập âm cuối.', 11, now(), now()),
    (212, 3, 'Lesson 12: Word Stress', 'Luyện tập trọng âm từ.', 12, now(), now()),
    (213, 3, 'Minitest 1', 'Bài kiểm tra nhỏ 1.', 13, now(), now()),
    (214, 3, 'Minitest 2', 'Bài kiểm tra nhỏ 2.', 14, now(), now()),
    (215, 3, 'Minitest 3', 'Bài kiểm tra nhỏ 3.', 15, now(), now()),
    (216, 3, 'Minitest 4', 'Bài kiểm tra nhỏ 4.', 16, now(), now()),
    (217, 3, 'Minitest 5', 'Bài kiểm tra nhỏ 5.', 17, now(), now()),
    (218, 3, 'Final Test', 'Bài kiểm tra cuối khóa.', 18, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Step 2: Delete existing pronunciation assets
DELETE FROM public.assets WHERE lessonid IN (201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218);

-- Step 3: Insert pronunciation assets (will be added from pronunciation-assets.sql)
-- This file should be run after this one

-- Update sequence for lessons
SELECT setval('public.lessons_id_seq', (SELECT COALESCE(MAX(id), 0) FROM public.lessons) + 1, false);

SELECT 'Pronunciation setup completed! Ready for assets.' as status;
