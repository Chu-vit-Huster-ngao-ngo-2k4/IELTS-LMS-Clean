-- Add Grammar Plus lessons
-- Course ID: 2 (Ngữ pháp cơ bản plus)

-- Delete existing lessons for Grammar Plus course
DELETE FROM public.lessons WHERE courseid = 2;

-- Insert Grammar Plus lessons
INSERT INTO public.lessons (id, courseid, title, orderindex, createdat) VALUES
-- Regular lessons
(100, 2, 'Danh từ', 1, NOW()),
(101, 2, 'Mind map 1', 2, NOW()),
(102, 2, 'Động từ', 3, NOW()),
(103, 2, 'Mind map 2', 4, NOW()),
(104, 2, 'Đại từ', 5, NOW()),
(105, 2, 'Mind map 3', 6, NOW()),
(106, 2, 'Tính từ và trạng từ', 7, NOW()),
(107, 2, 'Giới từ', 8, NOW()),
(108, 2, 'Mind map 4', 9, NOW()),
(109, 2, 'Các mẫu câu', 10, NOW()),
(110, 2, 'Mind map 5', 11, NOW()),

-- Mini tests
(111, 2, 'Mini test 1', 12, NOW()),
(112, 2, 'Mini test 2', 13, NOW()),
(113, 2, 'Mini test 3', 14, NOW()),
(114, 2, 'Mini test 4', 15, NOW()),

-- Final test
(115, 2, 'Final test', 16, NOW());

-- Update course title to be more specific
UPDATE public.courses 
SET title = 'Ngữ pháp cơ bản plus' 
WHERE id = 2;
