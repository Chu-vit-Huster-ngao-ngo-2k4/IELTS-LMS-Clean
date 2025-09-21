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
        // Check if user has admin role
        const { data: adminData, error: adminError } = await supabase
          .rpc('user_has_role', {
            user_id: user.id,
            role_name: 'admin'
          });

        if (adminError) {
          console.error('Error checking admin role:', adminError);
        } else {
          setIsAdmin(adminData || false);
        }

        // Check if user has instructor role
        const { data: instructorData, error: instructorError } = await supabase
          .rpc('user_has_role', {
            user_id: user.id,
            role_name: 'instructor'
          });

        if (instructorError) {
          console.error('Error checking instructor role:', instructorError);
        } else {
          setIsInstructor(instructorData || false);
        }
      } catch (error) {
        console.error('Error checking user roles:', error);
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
