import { useAuth } from '@/components/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useCallback } from 'react';

export const useUserActivity = () => {
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const logActivity = useCallback(async (
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: any
  ) => {
    if (!user) return;

    try {
      // Insert directly into user_activity table
      const { error } = await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          user_email: user.email,
          action: action,
          resource_type: resourceType || null,
          resource_id: resourceId || null,
          details: details || null
        });

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [user, supabase]);

  return { logActivity };
};
