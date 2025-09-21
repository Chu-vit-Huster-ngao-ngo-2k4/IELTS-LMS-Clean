import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';

export const useUserActivity = () => {
  const { user } = useAuth();

  const logActivity = useCallback(async (
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: any
  ) => {
    if (!user) return;

    try {
      await supabase.rpc('log_user_activity', {
        p_action: action,
        p_resource_type: resourceType || null,
        p_resource_id: resourceId || null,
        p_details: details || null
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [user]);

  return { logActivity };
};
