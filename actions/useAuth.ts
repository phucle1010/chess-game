"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authService,
  SignUpData,
  SignInData,
  ResetPasswordData,
} from "@/services/client/auth.service";

export function useAuth() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignUpData) => authService.signUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInData) => authService.signIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.clear();
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordData) => authService.resetPassword(data),
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (newPassword: string) =>
      authService.updatePassword(newPassword),
  });
}
