'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/components/AuthProvider';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useUserRole() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsInstructor(false);
        setLoading(false);
        return;
      }

      try {
        // Simple admin check - check if user email is in admin list
        const adminEmails = [
          'admin@example.com',
          'buiva@example.com', 
          'test@example.com',
          'admin@gmail.com',
          'buiva@gmail.com'
        ];
        
        const isAdminUser = adminEmails.includes(user.email || '');
        setIsAdmin(isAdminUser);
        setIsInstructor(isAdminUser);
        
        console.log('User email:', user.email);
        console.log('Is admin:', isAdminUser);
      } catch (error) {
        console.error('Error checking user roles:', error);
        setIsAdmin(false);
        setIsInstructor(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user]);

  return {
    isAdmin,
    isInstructor,
    loading,
    hasRole: (role: string) => {
      if (role === 'admin') return isAdmin;
      if (role === 'instructor') return isInstructor;
      return false;
    }
  };
}
