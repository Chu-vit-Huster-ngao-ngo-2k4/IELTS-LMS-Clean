// Script to setup progress tracking system
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupProgressTracking() {
  try {
    console.log('🚀 Setting up progress tracking system...');
    
    // Read SQL file
    const fs = require('fs');
    const sqlContent = fs.readFileSync('database/create-progress-tracking.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.log(`⚠️  Statement ${i + 1} warning:`, error.message);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`❌ Statement ${i + 1} error:`, err.message);
        }
      }
    }
    
    console.log('🎉 Progress tracking system setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Test the dashboard at /dashboard');
    console.log('2. Visit a lesson to start tracking progress');
    console.log('3. Check achievements in the dashboard');
    
  } catch (error) {
    console.error('❌ Error setting up progress tracking:', error);
    console.log('\n🔧 Manual setup required:');
    console.log('1. Go to Supabase SQL Editor');
    console.log('2. Run the file: database/create-progress-tracking.sql');
    console.log('3. Execute all statements');
  }
}

setupProgressTracking();
