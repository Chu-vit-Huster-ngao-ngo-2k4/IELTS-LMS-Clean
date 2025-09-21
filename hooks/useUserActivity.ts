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
      // Use RPC function to log activity
      const { error } = await supabase.rpc('log_user_activity', {
        p_action: action,
        p_resource_type: resourceType || null,
        p_resource_id: resourceId || null,
        p_details: details || null
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
