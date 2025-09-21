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

      // Check if user role exists
      const { data: existingRole, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('❌ Error checking user role:', roleError);
        rl.close();
        return;
      }

      if (existingRole) {
        // Update existing role
        console.log('📝 Updating existing user role...');
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ role: 'admin' })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('❌ Error updating user role:', updateError);
        } else {
          console.log('✅ User role updated to admin!');
        }
      } else {
        // Create new role
        console.log('📝 Creating new user role with admin...');
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'admin'
          });

        if (insertError) {
          console.error('❌ Error creating user role:', insertError);
        } else {
          console.log('✅ User role created with admin!');
        }
      }

      rl.close();
    });

  } catch (error) {
    console.error('❌ Error assigning admin role:', error.message);
  }
}

assignAdminRole();
