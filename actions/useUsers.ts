"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/client/user.service";
import { User } from "@/types/database";

export function useUser(userId: string | null) {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => (userId ? userService.getUser(userId) : null),
    enabled: !!userId,
  });
}

export function useUsers(limit?: number) {
  return useQuery({
    queryKey: ["users", "list", limit],
    queryFn: () => userService.getUsers(limit),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Partial<User>;
    }) => userService.updateUser(userId, updates),
    onSuccess: (user) => {
      queryClient.setQueryData(["users", user.id], user);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      result,
      ratingChange,
    }: {
      userId: string;
      result: "win" | "loss" | "draw";
      ratingChange: number;
    }) => userService.updateRating(userId, result, ratingChange),
    onSuccess: (user) => {
      queryClient.setQueryData(["users", user.id], user);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
