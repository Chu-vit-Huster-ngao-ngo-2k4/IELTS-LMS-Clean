const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPronunciationInDB() {
  try {
    console.log('🔍 Checking pronunciation assets in database...\n');
    
    // Get pronunciation lessons (Course ID 3)
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, courseid')
      .eq('courseid', 3)
      .order('id');
    
    if (lessonsError) throw lessonsError;
    
    console.log(`📚 Found ${lessons.length} pronunciation lessons:\n`);
    lessons.forEach(lesson => {
      console.log(`  ${lesson.id}: ${lesson.title}`);
    });
    
    console.log('\n🔍 Checking assets for pronunciation lessons...\n');
    
    // Get assets for pronunciation lessons
    const lessonIds = lessons.map(l => l.id);
    const { data: assets, error: assetsError } = await supabase
      .from('assets')
      .select('*')
      .in('lessonid', lessonIds)
      .order('lessonid, assettype');
    
    if (assetsError) throw assetsError;
    
    console.log(`📁 Found ${assets.length} pronunciation assets:\n`);
    
    // Group by lesson
    const assetsByLesson = {};
    assets.forEach(asset => {
      if (!assetsByLesson[asset.lessonid]) {
        assetsByLesson[asset.lessonid] = [];
      }
      assetsByLesson[asset.lessonid].push(asset);
    });
    
    // Display results
    Object.keys(assetsByLesson).sort((a, b) => parseInt(a) - parseInt(b)).forEach(lessonId => {
      const lesson = lessons.find(l => l.id == lessonId);
      console.log(`📁 Lesson ${lessonId}: ${lesson?.title || 'Unknown'}`);
      
      const lessonAssets = assetsByLesson[lessonId];
      lessonAssets.forEach(asset => {
        const sizeKB = (asset.sizebytes / 1024).toFixed(1);
        console.log(`  ✅ ${asset.assettype}: ${asset.title} (${sizeKB} KB)`);
        console.log(`     Key: ${asset.providerkey}`);
      });
      console.log('');
    });
    
    // Check for missing assets
    console.log('🔍 Checking for missing assets...\n');
    
    const expectedAssetTypes = ['video', 'audio', 'document'];
    
    lessons.forEach(lesson => {
      const lessonAssets = assetsByLesson[lesson.id] || [];
      const foundTypes = lessonAssets.map(asset => asset.assettype);
      
      console.log(`📁 Lesson ${lesson.id}: ${lesson.title}`);
      expectedAssetTypes.forEach(type => {
        const hasType = foundTypes.includes(type);
        const count = lessonAssets.filter(asset => asset.assettype === type).length;
        console.log(`  ${hasType ? '✅' : '❌'} ${type}: ${count} files`);
      });
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
}

checkPronunciationInDB();
