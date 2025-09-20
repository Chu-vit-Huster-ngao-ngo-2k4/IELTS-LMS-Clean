-- Check vocabulary assets
SELECT 'Vocabulary Assets Count:' as info, COUNT(*) as count 
FROM public.assets a
JOIN public.lessons l ON a.lessonid = l.id
WHERE l.courseid = 1;

-- Check lesson 1 assets specifically
SELECT 'Lesson 1 Assets:' as info;
SELECT id, title, assettype, mimetype, providerkey 
FROM public.assets 
WHERE lessonid = 1 
ORDER BY assettype, title;

-- Check if exercises exist
SELECT 'Exercise Assets:' as info;
SELECT id, title, assettype, mimetype 
FROM public.assets 
WHERE lessonid = 1 
AND assettype = 'document' 
AND title LIKE '%exercise%'
ORDER BY title;
