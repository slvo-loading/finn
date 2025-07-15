"use client";

import { supabase } from "@/lib//supabase";
import { Session, User } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Define the shape of your context
type AuthContextType = {
  session: Session | null;
  user: User | null;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Define props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

//import { useAuth } from '@/path/to/AuthProvider';
// const { session } = useAuth();
// condiitonally render componets for authenticated users with session