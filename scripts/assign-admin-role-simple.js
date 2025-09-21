const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function assignAdminRole() {
  try {
    console.log('🔧 Assigning admin role to user...\n');
    
    // Get all users
    console.log('👥 Fetching users...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }

    console.log(`📊 Found ${users.users.length} users\n`);

    // Ask user which email to make admin
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter email address to make admin: ', async (email) => {
      // Find user by email
      const user = users.users.find(u => u.email === email);
      
      if (!user) {
        console.log('❌ User not found with email:', email);
        rl.close();
        return;
      }

      console.log(`👤 Found user: ${user.email} (${user.id})`);

      // Check if user profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Error checking user profile:', profileError);
        rl.close();
        return;
      }

      if (existingProfile) {
        // Update existing profile
        console.log('📝 Updating existing user profile...');
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ role: 'admin' })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('❌ Error updating user profile:', updateError);
        } else {
          console.log('✅ User profile updated with admin role!');
        }
      } else {
        // Create new profile
        console.log('📝 Creating new user profile with admin role...');
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: user.email,
            role: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('❌ Error creating user profile:', insertError);
        } else {
          console.log('✅ User profile created with admin role!');
        }
      }

      rl.close();
    });

  } catch (error) {
    console.error('❌ Error assigning admin role:', error.message);
  }
}

assignAdminRole();
