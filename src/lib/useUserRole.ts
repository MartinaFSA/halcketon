"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/client";
import type { User } from "@supabase/supabase-js";

type AuthState = {
  user: User | null;
  role: string | null;
  loading: boolean;
};

export function useUserRole() {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let role = null;

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        role = profile?.role ?? null;
      }

      setState({
        user,
        role,
        loading: false,
      });
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    ...state,
    isAuthenticated: !!state.user,
    isAdmin: state.role === "admin",
    isDonor: state.role === "donor",
  };
}