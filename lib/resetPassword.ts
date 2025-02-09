import { supabase } from "@lib/supabaseClient";

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export default resetPassword;
