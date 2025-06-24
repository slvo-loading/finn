"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {setError(error.message);
    } else {
    router.push("/main"); // ✅ go to your app's home page
  }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4">Login / Sign Up</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-4"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-black text-white px-4 py-2 mr-2"
        onClick={handleSignIn}
        disabled={loading}
      >
        Sign In
      </button>

      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={handleSignUp}
        disabled={loading}
      >
        Sign Up
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
