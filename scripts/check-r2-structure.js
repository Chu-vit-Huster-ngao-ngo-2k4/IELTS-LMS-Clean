const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET;

async function checkR2Structure() {
  try {
    console.log('🔍 Checking R2 structure...\n');
    
    // List all objects
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });
    
    const response = await r2Client.send(command);
    const objects = response.Contents || [];
    
    console.log(`📊 Found ${objects.length} files on R2\n`);
    
    // Group by course
    const courses = {};
    objects.forEach(obj => {
      const key = obj.Key;
      const parts = key.split('/');
      
      if (parts.length >= 2) {
        const course = parts[0]; // courses, foundation, etc.
        if (!courses[course]) {
          courses[course] = [];
        }
        courses[course].push({
          key,
          size: obj.Size,
          lastModified: obj.LastModified
        });
      }
    });
    
    // Display structure
    Object.keys(courses).sort().forEach(course => {
      console.log(`📁 ${course}/`);
      courses[course].forEach(file => {
        const sizeKB = (file.size / 1024).toFixed(1);
        const type = file.key.split('.').pop();
        console.log(`  ${file.key} (${sizeKB} KB, ${type})`);
      });
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking R2:', error.message);
  }
}

checkR2Structure();
