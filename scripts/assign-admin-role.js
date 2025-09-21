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
    console.log('🔧 Setting up admin role system...\n');
    
    // First, run the SQL to create roles table
    console.log('📝 Creating roles table...');
    const { error: sqlError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create roles table
        CREATE TABLE IF NOT EXISTS public.roles (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) UNIQUE NOT NULL,
          description TEXT,
          createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create user_roles table (many-to-many relationship)
        CREATE TABLE IF NOT EXISTS public.user_roles (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          role_id INTEGER REFERENCES public.roles(id) ON DELETE CASCADE,
          createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, role_id)
        );

        -- Insert default roles
        INSERT INTO public.roles (name, description) VALUES
        ('admin', 'Administrator with full access'),
        ('user', 'Regular user with limited access'),
        ('instructor', 'Instructor with course management access')
        ON CONFLICT (name) DO NOTHING;
      `
    });

    if (sqlError) {
      console.error('❌ Error creating roles table:', sqlError);
      return;
    }

    console.log('✅ Roles table created successfully\n');

    // Get all users
    console.log('👥 Fetching users...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }

    console.log(`📊 Found ${users.users.length} users\n`);

    // Get admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .single();

    if (roleError) {
      console.error('❌ Error fetching admin role:', roleError);
      return;
    }

    console.log('🔑 Admin role ID:', adminRole.id);

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

      // Assign admin role
      const { error: assignError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role_id: adminRole.id
        });

      if (assignError) {
        if (assignError.code === '23505') {
          console.log('✅ User already has admin role');
        } else {
          console.error('❌ Error assigning admin role:', assignError);
        }
      } else {
        console.log('✅ Admin role assigned successfully!');
      }

      rl.close();
    });

  } catch (error) {
    console.error('❌ Error setting up admin role:', error.message);
  }
}

assignAdminRole();
