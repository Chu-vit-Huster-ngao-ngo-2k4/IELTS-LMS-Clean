// Script to test progress tracking system
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testProgressTracking() {
  try {
    console.log('🧪 Testing Progress Tracking System...\n');

    // 1. Get a test user (first user in auth.users)
    console.log('1️⃣ Getting test user...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError || !users.users.length) {
      console.error('❌ No users found. Please create a user first.');
      return;
    }

    const testUser = users.users[0];
    console.log(`✅ Found test user: ${testUser.email} (${testUser.id})`);

    // 2. Get first 2 lessons from first course
    console.log('\n2️⃣ Getting lessons...');
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
      console.error('❌ No courses found.');
      return;
    }

    const course = courses[0];
    console.log(`✅ Found course: ${course.title} (ID: ${course.id})`);

    if (!course.lessons || course.lessons.length < 2) {
      console.error('❌ Course needs at least 2 lessons for testing.');
      return;
    }

    const lesson1 = course.lessons[0];
    const lesson2 = course.lessons[1];
    console.log(`✅ Found lessons: "${lesson1.title}" and "${lesson2.title}"`);

    // 3. Get assets for these lessons
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

    console.log(`✅ Found ${assets1.length} assets for lesson 1, ${assets2.length} assets for lesson 2`);

    // 4. Mark lesson 1 as started and completed
    console.log('\n4️⃣ Marking lesson 1 as started...');
    for (const asset of assets1) {
      const { error: startError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: testUser.id,
          course_id: course.id,
          lesson_id: lesson1.id,
          asset_id: asset.id,
          progress_type: 'started',
          completion_percentage: 0,
          time_spent: 0,
          last_accessed: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id,asset_id'
        });

      if (startError) {
        console.error('❌ Error marking as started:', startError);
        return;
      }
    }

    console.log('✅ Lesson 1 marked as started');

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n5️⃣ Marking lesson 1 as completed...');
    for (const asset of assets1) {
      const { error: completeError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: testUser.id,
          course_id: course.id,
          lesson_id: lesson1.id,
          asset_id: asset.id,
          progress_type: 'completed',
          completion_percentage: 100,
          time_spent: 300, // 5 minutes
          last_accessed: new Date().toISOString(),
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id,asset_id'
        });

      if (completeError) {
        console.error('❌ Error marking as completed:', completeError);
        return;
      }
    }

    console.log('✅ Lesson 1 marked as completed');

    // 6. Mark lesson 2 as started and completed
    console.log('\n6️⃣ Marking lesson 2 as started...');
    for (const asset of assets2) {
      const { error: startError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: testUser.id,
          course_id: course.id,
          lesson_id: lesson2.id,
          asset_id: asset.id,
          progress_type: 'started',
          completion_percentage: 0,
          time_spent: 0,
          last_accessed: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id,asset_id'
        });

      if (startError) {
        console.error('❌ Error marking as started:', startError);
        return;
      }
    }

    console.log('✅ Lesson 2 marked as started');

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n7️⃣ Marking lesson 2 as completed...');
    for (const asset of assets2) {
      const { error: completeError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: testUser.id,
          course_id: course.id,
          lesson_id: lesson2.id,
          asset_id: asset.id,
          progress_type: 'completed',
          completion_percentage: 100,
          time_spent: 450, // 7.5 minutes
          last_accessed: new Date().toISOString(),
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id,asset_id'
        });

      if (completeError) {
        console.error('❌ Error marking as completed:', completeError);
        return;
      }
    }

    console.log('✅ Lesson 2 marked as completed');

    // 7. Update course progress
    console.log('\n8️⃣ Updating course progress...');
    const { error: updateError } = await supabase.rpc('update_course_progress', {
      p_user_id: testUser.id,
      p_course_id: course.id
    });

    if (updateError) {
      console.error('❌ Error updating course progress:', updateError);
      return;
    }

    console.log('✅ Course progress updated');

    // 8. Check for achievements
    console.log('\n9️⃣ Checking achievements...');
    const { error: achievementError } = await supabase.rpc('check_achievements', {
      p_user_id: testUser.id,
      p_achievement_type: 'first_lesson'
    });

    if (achievementError) {
      console.error('❌ Error checking achievements:', achievementError);
    } else {
      console.log('✅ Achievements checked');
    }

    // 9. Display results
    console.log('\n📊 Results:');
    
    // Get course progress
    const { data: courseProgress, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', testUser.id)
      .eq('course_id', course.id)
      .single();

    if (progressError) {
      console.error('❌ Error fetching course progress:', progressError);
    } else {
      console.log(`📈 Course Progress: ${courseProgress.overall_progress}%`);
      console.log(`📚 Completed Lessons: ${courseProgress.completed_lessons}/${courseProgress.total_lessons}`);
      console.log(`📄 Completed Assets: ${courseProgress.completed_assets}/${courseProgress.total_assets}`);
    }

    // Get achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', testUser.id);

    if (achievementsError) {
      console.error('❌ Error fetching achievements:', achievementsError);
    } else {
      console.log(`🏆 Achievements: ${achievements.length} earned`);
      achievements.forEach(achievement => {
        console.log(`   - ${achievement.icon} ${achievement.achievement_name}: ${achievement.description}`);
      });
    }

    console.log('\n✅ Progress tracking test completed!');
    console.log('\n🌐 Now check your dashboard at: http://localhost:3000/dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testProgressTracking();

