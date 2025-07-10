
import { supabase } from '@/integrations/supabase/client';

export const getUserDbId = async (authUserId: string): Promise<string | null> => {
  if (!authUserId) return null;
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', authUserId)
      .single();

    if (error) {
      console.error('Error fetching user database ID:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Error in getUserDbId:', error);
    return null;
  }
};
