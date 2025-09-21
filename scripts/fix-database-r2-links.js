const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping từ R2 structure đến database
const r2Mapping = {
  // Course 1: Vocabulary Basic
  1: {
    courseName: 'vocabulary-basic',
    lessons: {
      1: 'lesson-1',
      2: 'lesson-2', 
      3: 'lesson-3',
      4: 'lesson-4',
      5: 'lesson-5',
      6: 'lesson-6',
      7: 'lesson-7',
      8: 'lesson-8',
      9: 'lesson-9',
      10: 'lesson-10'
    }
  },
  // Course 3: Pronunciation Basic  
  3: {
    courseName: 'pronunciation-basic',
    lessons: {
      201: 'lesson-1',
      202: 'lesson-2',
      203: 'lesson-3', 
      204: 'lesson-4',
      205: 'lesson-5',
      206: 'lesson-6',
      207: 'lesson-7',
      208: 'lesson-8',
      209: 'lesson-9',
      210: 'lesson-10',
      211: 'lesson-11',
      212: 'lesson-12',
      213: 'lesson-13', // Minitest 1
      214: 'lesson-14', // Minitest 2
      215: 'lesson-15', // Minitest 3
      216: 'lesson-16', // Minitest 4
      217: 'lesson-17', // Minitest 5
      218: 'lesson-18'  // Final Test
    }
  },
  // Course 4: Listening Gap-Filling
  4: {
    courseName: 'listening-gap-filling',
    lessons: {
      1: 'lesson-1',
      2: 'lesson-2',
      3: 'lesson-3',
      4: 'lesson-4',
      5: 'lesson-5',
      6: 'lesson-6',
      7: 'lesson-7',
      8: 'lesson-8',
      9: 'lesson-9',
      10: 'lesson-10',
      11: 'lesson-11',
      12: 'lesson-12',
      13: 'lesson-13',
      14: 'lesson-14',
      15: 'lesson-15'
    }
  }
};

async function fixDatabaseLinks() {
  try {
    console.log('🔧 Fixing database links to match R2 structure...\n');
    
    for (const [courseId, courseInfo] of Object.entries(r2Mapping)) {
      console.log(`📚 Processing Course ${courseId}: ${courseInfo.courseName}`);
      
      for (const [lessonId, r2LessonName] of Object.entries(courseInfo.lessons)) {
        console.log(`  📖 Lesson ${lessonId}: ${r2LessonName}`);
        
        // Get current assets for this lesson
        const { data: assets, error: assetsError } = await supabase
          .from('assets')
          .select('*')
          .eq('lessonid', parseInt(lessonId));
        
        if (assetsError) {
          console.error(`    ❌ Error fetching assets: ${assetsError.message}`);
          continue;
        }
        
        if (!assets || assets.length === 0) {
          console.log(`    ⚠️  No assets found for lesson ${lessonId}`);
          continue;
        }
        
        // Update each asset with correct R2 path
        for (const asset of assets) {
          const newProviderKey = generateR2Path(courseInfo.courseName, r2LessonName, asset);
          
          if (newProviderKey !== asset.providerkey) {
            console.log(`    🔄 Updating: ${asset.title}`);
            console.log(`      Old: ${asset.providerkey}`);
            console.log(`      New: ${newProviderKey}`);
            
            const { error: updateError } = await supabase
              .from('assets')
              .update({ providerkey: newProviderKey })
              .eq('id', asset.id);
            
            if (updateError) {
              console.error(`      ❌ Update failed: ${updateError.message}`);
            } else {
              console.log(`      ✅ Updated successfully`);
            }
          }
        }
      }
      console.log('');
    }
    
    console.log('🎉 Database links updated successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database links:', error.message);
  }
}

function generateR2Path(courseName, lessonName, asset) {
  const basePath = `courses/foundation/${courseName}/${lessonName}`;
  
  // Determine file type and naming pattern
  if (asset.assettype === 'video') {
    if (asset.title.includes('video-2') || asset.title.includes('section2')) {
      return `${basePath}/lesson-${lessonName.split('-')[1]}-video-Section 2.mp4`;
    } else if (asset.title.includes('video-3') || asset.title.includes('section3')) {
      return `${basePath}/lesson-${lessonName.split('-')[1]}-video-Section 3.mp4`;
    } else {
      return `${basePath}/lesson-${lessonName.split('-')[1]}-video.mp4`;
    }
  } else if (asset.assettype === 'audio') {
    // Audio files have various naming patterns
    return `${basePath}/lesson-${lessonName.split('-')[1]}-audio.mp3`;
  } else if (asset.assettype === 'document') {
    if (asset.mimetype === 'application/pdf') {
      if (asset.title.includes('handout') || asset.title.includes('exercise')) {
        return `${basePath}/lesson-${lessonName.split('-')[1]}-handout.pdf`;
      } else {
        return `${basePath}/lesson-${lessonName.split('-')[1]}-handout.pdf`;
      }
    } else if (asset.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return `${basePath}/lesson-${lessonName.split('-')[1]}-answer.docx`;
    }
  } else if (asset.assettype === 'image') {
    return `${basePath}/lesson-${lessonName.split('-')[1]}-image.jpg`;
  }
  
  // Fallback to original
  return asset.providerkey;
}

fixDatabaseLinks();
