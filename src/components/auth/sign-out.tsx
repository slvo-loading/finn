"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/"); // ✅ go back to login page
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Sign Out
    </button>
  );
}
