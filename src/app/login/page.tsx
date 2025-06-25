"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";
import { PasswordInput } from "@/components/auth/password-input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push("/main"); // or wherever your app home is
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
  <div className="w-full max-w-md rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">

    {/* Logo */}
    <div className="absolute top-5 left-5">
      <div className="flex items-center justify-center gap-2">
        <img
          src="hydralogo.png"
          alt="Team Logo"
          className="w-full h-auto max-w-[1.5rem] transition-all object-contain"
        />
        <span className="font-bold text-[#a6d1eb] text-2xl">Hydra</span>
      </div>
    </div>

    {/* Welcome message */}
    <div className="flex items-center justify-center w-full">
    <span className="text-2xl font-semibold">Welcome back 👋</span>
    </div>

    {/* Inputs */}
    <div className="space-y-3">
      <input value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring focus:ring-[#a6d1eb] text-sm"
      />
      {/* <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring focus:ring-[#a6d1eb] text-sm"
      /> */}
      <PasswordInput password={password} setPassword={setPassword} />
    </div>

    {/* Legal + CTA */}
    <p className="text-xs text-center text-gray-500">
      By logging in, you consent to Hydra’s{" "}
      <a href="#" className="underline">
        Terms of Use
      </a>{" "}
      and{" "}
      <a href="#" className="underline">
        Privacy Policy
      </a>.
    </p>

    <button onClick={handleSignIn} className="w-full bg-[#a6d1eb] hover:bg-[#97c1db] text-white font-semibold text-sm py-3 rounded-full transition">
      Log in
    </button>

    <div className="flex justify-between text-sm text-semibold text-gray-500">
      <a href="#" className="hover:underline">
        Forgot password?
      </a>
      <a href="/signup" className="hover:underline">
        Sign up
      </a>
    </div>

    {/* Divider */}
    <div className="flex items-center my-4">
      <hr className="flex-grow border-t border-gray-300" />
      <span className="mx-4 text-sm text-gray-500">OR</span>
      <hr className="flex-grow border-t border-gray-300" />
    </div>

    {/* Social login */}
    <button className="flex items-center justify-center w-full border border-gray-300 rounded-full py-3 hover:bg-accent transition gap-2">
      <FcGoogle size={20} />
      <span className="text-sm font-medium text-gray-700">
        Log in with Google
      </span>
    </button>

  </div>
</div>
</div>

  );
}
