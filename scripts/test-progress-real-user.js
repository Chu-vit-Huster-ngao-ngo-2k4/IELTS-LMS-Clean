// Script to test progress tracking with real user ID
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testProgressRealUser() {
  try {
    console.log('🧪 Testing Progress Tracking (Real User)...\n');

    // 1. Get real user from auth.users
    console.log('1️⃣ Getting real user...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError || !users.users.length) {
      console.error('❌ No users found. Please create a user first.');
      console.log('💡 You can create a user by:');
      console.log('   1. Go to http://localhost:3000/auth/register');
      console.log('   2. Register a new account');
      console.log('   3. Run this script again');
      return;
    }

    const testUser = users.users[0];
    console.log(`✅ Found user: ${testUser.email} (${testUser.id})`);

    // 2. Get first course and lessons
    console.log('\n2️⃣ Getting course data...');
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

    // 3. Get assets for lessons
    console.log('\n3️⃣ Getting assets...');
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

    // 4. Insert test progress data
    console.log('\n4️⃣ Inserting test progress...');
    
    const progressData = [];
    
    // Lesson 1 - completed
    for (const asset of assets1) {
      progressData.push({
        user_id: testUser.id,
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
        user_id: testUser.id,
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
      p_user_id: testUser.id,
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
        user_id: testUser.id,
        achievement_type: 'first_lesson',
        achievement_name: 'First Steps',
        description: 'Completed your first lesson!',
        icon: '🎯'
      },
      {
        user_id: testUser.id,
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
    console.log(`👤 User: ${testUser.email}`);
    console.log(`📚 Course: ${course.title}`);
    console.log(`📖 Lessons completed: 2`);
    console.log(`📄 Assets completed: ${assets1.length + assets2.length}`);
    console.log(`🏆 Achievements: 2`);

    console.log('\n✅ Test completed!');
    console.log('\n🌐 Now login with this user and check:');
    console.log(`   Email: ${testUser.email}`);
    console.log('   Dashboard: http://localhost:3000/dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testProgressRealUser();

