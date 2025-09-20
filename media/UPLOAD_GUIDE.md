# 📁 Hướng dẫn Upload Media Files

## 🎯 Cấu trúc thư mục cần copy files

```
media/
├── foundation/
│   ├── vocabulary/          # IELTS Foundation - Vocabulary (225 lessons)
│   ├── grammar/             # IELTS Foundation - Grammar (194 lessons)
│   ├── pronunciation/       # IELTS Foundation - Pronunciation (157 lessons)
│   └── listening/           # IELTS Foundation - Listening Gap-Filling (74 lessons)
├── basic-intermediate/
│   └── reading/             # IELTS Basic-Intermediate - Reading (167 lessons)
└── advanced/
    └── vocabulary/          # IELTS Advanced - Vocabulary (139 lessons)
```

## 📋 Quy tắc đặt tên file

### **Format tên file:**
- **Videos**: `lesson-{số}-video.mp4`
- **Audios**: `lesson-{số}-audio.mp3`
- **Documents**: `lesson-{số}-handout.pdf`

### **Ví dụ:**
```
lesson-1-video.mp4
lesson-1-audio.mp3
lesson-1-handout.pdf
lesson-2-video.mp4
lesson-2-audio.mp3
lesson-2-handout.pdf
...
lesson-20-video.mp4
lesson-20-audio.mp3
lesson-20-handout.pdf
```

## 🎬 Loại file được hỗ trợ

### **Videos:**
- **Format**: `.mp4` (khuyến nghị)
- **Codec**: H.264
- **Resolution**: 720p hoặc 1080p
- **Size**: < 100MB mỗi file

### **Audios:**
- **Format**: `.mp3` (khuyến nghị)
- **Bitrate**: 128kbps hoặc 192kbps
- **Size**: < 50MB mỗi file

### **Documents:**
- **Format**: `.pdf` (khuyến nghị)
- **Size**: < 10MB mỗi file

## 📚 Mapping khóa học với thư mục

| Khóa học | Thư mục | Số lessons |
|----------|---------|------------|
| IELTS Foundation - Vocabulary | `foundation/vocabulary/` | 225 |
| IELTS Foundation - Grammar | `foundation/grammar/` | 194 |
| IELTS Foundation - Pronunciation | `foundation/pronunciation/` | 157 |
| IELTS Foundation - Listening Gap-Filling | `foundation/listening/` | 74 |
| IELTS Basic-Intermediate - Reading | `basic-intermediate/reading/` | 167 |
| IELTS Advanced - Vocabulary | `advanced/vocabulary/` | 139 |

## 🚀 Các bước thực hiện

### **1. Chuẩn bị files**
- Download hoặc copy media files từ nguồn của bạn
- Đặt tên file theo format quy định
- Kiểm tra kích thước file

### **2. Copy files vào thư mục tương ứng**
```bash
# Ví dụ copy files cho Foundation Vocabulary
cp "your-video-files/*.mp4" media/foundation/vocabulary/
cp "your-audio-files/*.mp3" media/foundation/vocabulary/
cp "your-pdf-files/*.pdf" media/foundation/vocabulary/
```

### **3. Đổi tên files theo format**
```bash
# Đổi tên files theo format lesson-{số}-{type}.{ext}
# Ví dụ:
mv "video1.mp4" "lesson-1-video.mp4"
mv "audio1.mp3" "lesson-1-audio.mp3"
mv "handout1.pdf" "lesson-1-handout.pdf"
```

### **4. Upload lên R2**
```bash
# Sau khi copy xong, chạy script upload
./scripts/upload-media-to-r2.sh
```

### **5. Import vào database**
```bash
# Link media files với lessons trong database
node scripts/import-assets-mock.js
```

## ⚠️ Lưu ý quan trọng

1. **Không cần upload tất cả lessons** - có thể upload từng phần
2. **File names phải chính xác** - hệ thống dựa vào tên file để mapping
3. **Kiểm tra kích thước** - R2 có giới hạn storage
4. **Backup files gốc** - trước khi đổi tên

## 🔍 Kiểm tra sau khi upload

```bash
# Kiểm tra files đã copy
ls -la media/foundation/vocabulary/

# Kiểm tra upload lên R2
./rclone.exe --config rclone.conf tree r2:ielts-lms-media/

# Kiểm tra database
# Vào Supabase Dashboard > Table Editor > Assets
```

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra tên file có đúng format không
2. Kiểm tra kích thước file
3. Kiểm tra quyền truy cập thư mục
4. Chạy script upload với verbose mode: `./scripts/upload-media-to-r2.sh -v`
