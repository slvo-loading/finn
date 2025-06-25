"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function GoToSignUp() {
    const router = useRouter();

    return(
        <Button size="sm" className="w-full" onClick={() => router.push('/signup')}><span>Sign Up</span></Button>
    )

}