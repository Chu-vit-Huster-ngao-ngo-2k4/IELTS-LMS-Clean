// Simple script to test progress tracking with direct database access
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testProgressSimple() {
  try {
    console.log('🧪 Testing Progress Tracking (Simple)...\n');

    // 1. Get first course and lessons
    console.log('1️⃣ Getting course data...');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        lessons (
          id,
          title,
          courseid
        )
      `)
      .limit(1);

    if (coursesError || !courses.length) {
      console.error('❌ No courses found:', coursesError);
      return;
    }

    const course = courses[0];
    console.log(`✅ Course: ${course.title} (ID: ${course.id})`);

    if (!course.lessons || course.lessons.length < 2) {
      console.error('❌ Need at least 2 lessons');
      return;
    }

    const lesson1 = course.lessons[0];
    const lesson2 = course.lessons[1];
    console.log(`✅ Lessons: "${lesson1.title}" and "${lesson2.title}"`);

    // 2. Get assets for lessons
    console.log('\n2️⃣ Getting assets...');
    const { data: assets1, error: assets1Error } = await supabase
      .from('assets')
      .select('*')
      .eq('lessonid', lesson1.id)
      .limit(2);

    const { data: assets2, error: assets2Error } = await supabase
      .from('assets')
      .select('*')
      .eq('lessonid', lesson2.id)
      .limit(2);

    if (assets1Error || assets2Error) {
      console.error('❌ Error fetching assets:', assets1Error || assets2Error);
      return;
    }

    console.log(`✅ Assets: ${assets1.length} for lesson 1, ${assets2.length} for lesson 2`);

    // 3. Create a test user ID (you can replace this with a real user ID)
    const testUserId = '00000000-0000-0000-0000-000000000000'; // Placeholder UUID
    console.log(`\n3️⃣ Using test user ID: ${testUserId}`);

    // 4. Insert test progress data
    console.log('\n4️⃣ Inserting test progress...');
    
    const progressData = [];
    
    // Lesson 1 - completed
    for (const asset of assets1) {
      progressData.push({
        user_id: testUserId,
        course_id: course.id,
        lesson_id: lesson1.id,
        asset_id: asset.id,
        progress_type: 'completed',
        completion_percentage: 100,
        time_spent: 300,
        last_accessed: new Date().toISOString(),
        completed_at: new Date().toISOString()
      });
    }

    // Lesson 2 - completed
    for (const asset of assets2) {
      progressData.push({
        user_id: testUserId,
        course_id: course.id,
        lesson_id: lesson2.id,
        asset_id: asset.id,
        progress_type: 'completed',
        completion_percentage: 100,
        time_spent: 450,
        last_accessed: new Date().toISOString(),
        completed_at: new Date().toISOString()
      });
    }

    const { error: insertError } = await supabase
      .from('user_progress')
      .insert(progressData);

    if (insertError) {
      console.error('❌ Error inserting progress:', insertError);
      return;
    }

    console.log(`✅ Inserted ${progressData.length} progress records`);

    // 5. Update course progress
    console.log('\n5️⃣ Updating course progress...');
    const { error: updateError } = await supabase.rpc('update_course_progress', {
      p_user_id: testUserId,
      p_course_id: course.id
    });

    if (updateError) {
      console.error('❌ Error updating course progress:', updateError);
      return;
    }

    console.log('✅ Course progress updated');

    // 6. Add achievements
    console.log('\n6️⃣ Adding achievements...');
    const achievements = [
      {
        user_id: testUserId,
        achievement_type: 'first_lesson',
        achievement_name: 'First Steps',
        description: 'Completed your first lesson!',
        icon: '🎯'
      },
      {
        user_id: testUserId,
        achievement_type: 'course_completed',
        achievement_name: 'Course Master',
        description: 'Completed an entire course!',
        icon: '🏆'
      }
    ];

    const { error: achievementError } = await supabase
      .from('user_achievements')
      .insert(achievements);

    if (achievementError) {
      console.error('❌ Error inserting achievements:', achievementError);
    } else {
      console.log('✅ Achievements added');
    }

    // 7. Display results
    console.log('\n📊 Test Results:');
    console.log(`📚 Course: ${course.title}`);
    console.log(`📖 Lessons completed: 2`);
    console.log(`📄 Assets completed: ${assets1.length + assets2.length}`);
    console.log(`🏆 Achievements: 2`);

    console.log('\n✅ Test completed!');
    console.log('\n🌐 Check your dashboard to see the changes!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testProgressSimple();

