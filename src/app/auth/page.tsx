"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from 'sonner';

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!code && !email) {
      setCodeError(true);
      setEmailError(true);
      return;
    } else if (!code) {
      setCodeError(true);
      return;
    } else if( !email) {
      setEmailError(true);
      return;
    }

    const { 
      data: { session },
      error 
    } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: "email",
    });
  
    if (error) {
      toast.error("Invalid or expired code. Please try again.");
    } else {
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000",
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
    }
  };

    const handleSendCode = async () => {
      if (!email) {
        setEmailError(true);
        return;
      }
      setEmailError(false);
      setLoading(true);
  
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        setError(error.message); 
      } else {
      toast.success(`A verification code has been sent to ${email}.\n\nPlease check your inbox and spam folder.`)
      setLoading(false);
      setCountdown(60);
    }
    };

    // countdown logic
    useEffect(() => {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [countdown]);

    // useEffect(() => {
    //   const canvas = document.getElementById("cursorCanvas");
    //   const ctx = canvas.getContext("2d");
    
    //   let particles = [];
    
    //   const resize = () => {
    //     canvas.width = window.innerWidth;
    //     canvas.height = window.innerHeight;
    //   };
    
    //   const spawn = (x, y) => {
    //     particles.push({ x, y, r: 5, alpha: 1 });
    //   };
    
    //   const draw = () => {
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     particles.forEach((p, i) => {
    //       p.r += 0.5;
    //       p.alpha -= 0.02;
    //       ctx.beginPath();
    //       ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
    //       ctx.strokeStyle = `rgba(166, 209, 235, ${p.alpha})`;
    //       ctx.stroke();
    //     });
    //     particles = particles.filter(p => p.alpha > 0);
    //     requestAnimationFrame(draw);
    //   };
    
    //   window.addEventListener("resize", resize);
    //   window.addEventListener("mousemove", (e) => spawn(e.clientX, e.clientY));
    //   resize();
    //   draw();
    
    //   return () => {
    //     window.removeEventListener("resize", resize);
    //     window.removeEventListener("mousemove", spawn);
    //   };
    // }, []);
    
    
  return (
    <div className="w-screen h-screen flex items-center justify-center">

      {/* fun bubbles? */}
      {/* <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
        <canvas id="cursorCanvas" className="w-full h-full" />
      </div> */}


      {/* logo */}
      <div className="absolute top-5 left-5">
        <div className="flex items-center justify center gap-2">
          <img
            src="hydralogo.png"
            alt="Team Logo"
            className="w-full h-auto max-w-[1.5rem] transition-all object-contain"
          />
          <span className="font-bold text-[#a6d1eb] text-2xl">Hydra</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center justify-center w-full max-w-md rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">
        {/* title message */}
        <span className="text-2xl font-semibold">Ready to dive in?</span>

        {/* inputs */}
        <div className="w-full flex flex-col gap-1 items-center justify-center">
          {/* Email input */}
          <div className="w-full flex flex-col">
            <input value={email} onChange={(e) => {setEmail(e.target.value); setEmailError(false)}}
              placeholder="Email address"
              className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring text-sm
                ${emailError ? "border-red-400 focus-within:ring-red-200" : "border-gray-300 focus:ring-[#a6d1eb]"}`}
            />
            <p
              className={`text-xs text-red-500 mt-1 transition-opacity duration-200 ${
                emailError ? "opacity-100" : "opacity-0"
              }`}
            >
              Please enter your email address.
            </p>
          </div>

          {/* code input */}
          <div className="w-full flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                placeholder="Code"
                value={code}
                onChange={(e) => {setCode(e.target.value); setCodeError(false)}}
                className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring text-sm
                  ${codeError ? "border-red-400 focus-within:ring-red-200" : "border-gray-300 focus:ring-[#a6d1eb]"}`}
              />
              <Button size="lg" className="h-11" onClick={handleSendCode}> 
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                  <LoaderCircle className="animate-spin"/> 
                  <span>Send Code</span>
                  </div>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  "Send Code"
                )
                } </Button>
            </div>
              <p
                className={`text-xs text-red-500 mt-1 transition-opacity duration-200 ${
                  codeError ? "opacity-100" : "opacity-0"
                }`}
              >
                Please enter your code.
              </p>
            </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button onClick={handleSignIn} size="lg" className="w-full h-11">Continue</Button>
          
          {/* Legal + CTA */}
          <p className="text-xs text-center text-gray-500">
            By signing up or logging in, you consent to Hydra’s{" "}
            <a href="#" className="hover:underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>

        <div className="w-full flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm text-gray-500">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <Button onClick={handleGoogleLogin} variant="outline" className="w-full h-11">
          <FcGoogle/>Sign in with Google
        </Button>

      </div>
    </div>
  );
}
