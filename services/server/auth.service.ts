import { createServerClient } from "@/lib/supabase/server";
import { User } from "@/types/database";

export interface SignUpData {
  email: string;
  password: string;
  username: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export const authService = {
  async signUp(data: SignUpData) {
    const supabase = await createServerClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Failed to create user");

    // Create user profile
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: data.email,
      username: data.username,
      rating: 1200,
      wins: 0,
      losses: 0,
      draws: 0,
    });

    if (profileError) throw profileError;

    return authData;
  },

  async signIn(signInData: SignInData) {
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: signInData.email,
      password: signInData.password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(data: ResetPasswordData, redirectUrl: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: redirectUrl,
    });

    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const supabase = await createServerClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (error) throw error;
    return data;
  },

  async getSession() {
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  },
};
