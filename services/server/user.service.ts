import { createServerClient } from "@/lib/supabase/server";
import { User } from "@/types/database";

export const userService = {
  async getUser(userId: string): Promise<User | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getUsers(limit = 50): Promise<User[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRating(
    userId: string,
    result: "win" | "loss" | "draw",
    ratingChange: number
  ): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const updates: Partial<User> = {
      rating: user.rating + ratingChange,
    };

    if (result === "win") {
      updates.wins = (user.wins || 0) + 1;
    } else if (result === "loss") {
      updates.losses = (user.losses || 0) + 1;
    } else {
      updates.draws = (user.draws || 0) + 1;
    }

    return this.updateUser(userId, updates);
  },
};
