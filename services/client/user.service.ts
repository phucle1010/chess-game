// Client-side service that calls API routes instead of Supabase directly
import { User } from "@/types/database";
import { fetchWithErrorHandling } from "@/lib/api-error-handler";

const API_BASE = "/api";

export const userService = {
  async getUser(userId: string): Promise<User | null> {
    try {
      const response = await fetchWithErrorHandling(
        `${API_BASE}/users/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      return response.json();
    } catch (error) {
      if (error instanceof Error && error.message?.includes("Not Found")) {
        return null;
      }
      throw error;
    }
  },

  async getUsers(limit = 50): Promise<User[]> {
    const response = await fetchWithErrorHandling(
      `${API_BASE}/users?limit=${limit}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    return response.json();
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const response = await fetchWithErrorHandling(
      `${API_BASE}/users/${userId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      }
    );

    return response.json();
  },

  async updateRating(
    userId: string,
    result: "win" | "loss" | "draw",
    ratingChange: number
  ): Promise<User> {
    const response = await fetchWithErrorHandling(
      `${API_BASE}/users/${userId}/rating`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          result,
          ratingChange,
        }),
      }
    );

    return response.json();
  },
};
