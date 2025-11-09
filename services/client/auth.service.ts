import { User } from "@/types/database";
import { SignUpData, SignInData, ResetPasswordData } from "@/types/auth";
import { fetchWithErrorHandling } from "@/lib/api-error-handler";

const API_BASE = "/api";

export const authService = {
  async signUp(data: SignUpData) {
    const response = await fetchWithErrorHandling(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return response.json();
  },

  async signIn(signInData: SignInData) {
    const response = await fetchWithErrorHandling(`${API_BASE}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signInData),
    });

    return response.json();
  },

  async signOut() {
    await fetchWithErrorHandling(`${API_BASE}/auth/signout`, {
      method: "POST",
    });
  },

  async resetPassword(data: ResetPasswordData) {
    await fetchWithErrorHandling(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async updatePassword(newPassword: string) {
    await fetchWithErrorHandling(`${API_BASE}/auth/update-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetchWithErrorHandling(`${API_BASE}/auth/user`, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    } catch (error) {
      // Don't show toast for 401 (unauthorized) - it's expected when not logged in
      if (
        error instanceof Error &&
        (error.message?.includes("Unauthorized") ||
          error.message?.includes("Please login"))
      ) {
        return null;
      }
      throw error;
    }
  },

  async getSession() {
    const response = await fetchWithErrorHandling(`${API_BASE}/auth/session`, {
      method: "GET",
      credentials: "include",
    });

    return response.json();
  },
};
