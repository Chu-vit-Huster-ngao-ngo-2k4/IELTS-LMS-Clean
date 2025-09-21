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
        // Get user role from user_roles table
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          // Default to regular user if no role found
          setIsAdmin(false);
          setIsInstructor(false);
        } else {
          const role = userRole?.role || 'user';
          setIsAdmin(role === 'admin');
          setIsInstructor(role === 'instructor' || role === 'admin');
        }
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
