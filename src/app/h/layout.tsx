import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers"


export const metadata: Metadata = {
  title: "Hydra",
  description: "Your Eco Friendly AI Assistant",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
        <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar/>
            <main>
              {children}
            </main>
        </SidebarProvider>
  );
}