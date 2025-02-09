import { supabase } from "@lib/supabaseClient";

export const createUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Optionally send a confirmation email
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
