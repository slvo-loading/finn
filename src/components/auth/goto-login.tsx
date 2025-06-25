"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function GoToLogin() {
    const router = useRouter();

    return(
        <Button variant="outline" className="w-full" onClick={() => router.push('/login')}><span>Log In</span></Button>
    )

}