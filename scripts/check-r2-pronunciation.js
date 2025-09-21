const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// R2 configuration
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET || 'ielts-lms-media';

async function checkPronunciationFiles() {
  try {
    console.log('🔍 Checking pronunciation files on R2...\n');
    
    // List all objects with pronunciation prefix
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'pronunciation/',
    });
    
    const response = await r2Client.send(command);
    const objects = response.Contents || [];
    
    console.log(`📊 Found ${objects.length} pronunciation files on R2\n`);
    
    if (objects.length === 0) {
      console.log('❌ No pronunciation files found on R2');
      console.log('💡 You need to upload pronunciation files to R2 first');
      return;
    }
    
    // Group by lesson
    const lessonFiles = {};
    objects.forEach(obj => {
      const key = obj.Key;
      const parts = key.split('/');
      if (parts.length >= 2) {
        const lesson = parts[1]; // lesson-1, minitest-1, etc.
        if (!lessonFiles[lesson]) {
          lessonFiles[lesson] = [];
        }
        lessonFiles[lesson].push({
          key,
          size: obj.Size,
          lastModified: obj.LastModified
        });
      }
    });
    
    // Display results
    Object.keys(lessonFiles).sort().forEach(lesson => {
      console.log(`📁 ${lesson}:`);
      lessonFiles[lesson].forEach(file => {
        const sizeKB = (file.size / 1024).toFixed(1);
        const type = file.key.split('.').pop();
        console.log(`  ✅ ${file.key} (${sizeKB} KB, ${type})`);
      });
      console.log('');
    });
    
    // Check for missing files
    console.log('🔍 Checking for missing files...\n');
    
    const expectedLessons = [
      'lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6',
      'lesson-7', 'lesson-8', 'lesson-9', 'lesson-10', 'lesson-11', 'lesson-12',
      'minitest-1', 'minitest-2', 'minitest-3', 'minitest-4', 'minitest-5',
      'final-test'
    ];
    
    const expectedFiles = ['video.mp4', 'audio.mp3', 'exercise.pdf', 'answer.docx'];
    
    expectedLessons.forEach(lesson => {
      const lessonFiles = objects.filter(obj => obj.Key.includes(lesson));
      const foundFiles = lessonFiles.map(obj => obj.Key.split('/').pop());
      
      console.log(`📁 ${lesson}:`);
      expectedFiles.forEach(expectedFile => {
        if (foundFiles.includes(expectedFile)) {
          console.log(`  ✅ ${expectedFile}`);
        } else {
          console.log(`  ❌ ${expectedFile} - MISSING`);
        }
      });
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking R2:', error.message);
    
    if (error.message.includes('InvalidAccessKeyId')) {
      console.log('💡 Check your R2 credentials in .env file');
    } else if (error.message.includes('NoSuchBucket')) {
      console.log('💡 Check your R2 bucket name in .env file');
    }
  }
}

// Load environment variables
require('dotenv').config();

checkPronunciationFiles();
