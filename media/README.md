# IELTS LMS Media Files

## 📁 Cấu trúc thư mục

```
media/
├── foundation/
│   ├── vocabulary/          # IELTS Foundation - Vocabulary
│   ├── grammar/             # IELTS Foundation - Grammar  
│   ├── pronunciation/       # IELTS Foundation - Pronunciation
│   └── listening/           # IELTS Foundation - Listening Gap-Filling
├── basic-intermediate/
│   └── reading/             # IELTS Basic-Intermediate - Reading
└── advanced/
    └── vocabulary/          # IELTS Advanced - Vocabulary
```

## 📋 Hướng dẫn upload

### 1. Copy media files vào thư mục tương ứng
- **Videos**: `.mp4` files
- **Audios**: `.mp3` files  
- **Documents**: `.pdf` files

### 2. Đặt tên file theo format:
- `lesson-1-video.mp4`
- `lesson-1-audio.mp3`
- `lesson-1-handout.pdf`
- `lesson-2-video.mp4`
- ...

### 3. Upload lên R2:
```bash
./scripts/upload-media-to-r2.sh
```

### 4. Import vào database:
```bash
node scripts/import-assets-mock.js
```

## 🎯 Các khóa học cần media:

1. **IELTS Foundation - Vocabulary** (225 lessons)
2. **IELTS Foundation - Grammar** (194 lessons)
3. **IELTS Foundation - Pronunciation** (157 lessons)
4. **IELTS Foundation - Listening Gap-Filling** (74 lessons)
5. **IELTS Basic-Intermediate - Reading** (167 lessons)
6. **IELTS Advanced - Vocabulary** (139 lessons)

**Tổng cộng: 956 lessons cần media files!**
