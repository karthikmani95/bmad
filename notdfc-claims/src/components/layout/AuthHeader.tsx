"use client";

import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function AuthHeader() {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const displayName = user?.email?.split("@")[0] ?? "Guest";
  const role = "Retail Customer";

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end mr-2">
        <span className="text-sm font-medium text-gray-900 leading-none">
          {displayName}
        </span>
        <span className="text-xs text-notdfc-navy-light/60">{role}</span>
      </div>
      <div className="w-10 h-10 rounded-full bg-notdfc-navy-deep flex items-center justify-center text-white ring-2 ring-notdfc-silver ring-offset-2">
        <User className="w-5 h-5" />
      </div>
    </div>
  );
}
