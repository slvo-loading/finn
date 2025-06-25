"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";
import { Hash } from "lucide-react";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordConfirmationInput } from "@/components/auth/confirm-password";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push("/main"); // or wherever your app home is
    }
  };


  const handleSendCode = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
    if (error) setError(error.message);
    else setIsSent(true);
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
      <PasswordInput password={password} setPassword={setPassword} />
      <PasswordConfirmationInput password={password}  confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}/>
      <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl w-full">
            <Hash className="text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>
          <button onClick={handleSendCode} className="px-4 border border-gray-300 rounded-xl text-sm">
            Send code
          </button>
        </div>

    </div>

    {/* Legal + CTA */}
    <p className="text-xs text-center text-gray-500">
      By signing up, you consent to Hydra’s{" "}
      <a href="#" className="underline">
        Terms of Use
      </a>{" "}
      and{" "}
      <a href="#" className="underline">
        Privacy Policy
      </a>.
    </p>

    <button onClick={handleSignIn} className="w-full bg-[#a6d1eb] hover:bg-[#97c1db] text-white font-semibold text-sm py-3 rounded-full transition">
      Sign up
    </button>

    <div className="flex justify-center text-sm text-semibold text-gray-500">
      <a href="/login" className="hover:underline">
        Log in
      </a>
    </div>

  </div>
</div>
</div>

  );
}
