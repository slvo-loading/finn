import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers"
import { WaterTank } from "@/components/water-tank";
import { ModelSelector } from "@/components/model-selector";
import { CoinDisplay } from "@/components/coin-display";
import { RefillButton } from "@/components/refill-button";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

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
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
        <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar/>
        <ResizablePanelGroup direction="horizontal" autoSaveId="resizable-panel-group">
        <ResizablePanel className="flex flex-col">
            <main>
              <div className="flex items-center justify-between m-2">
                <ModelSelector/>
                <div className="flex items-center justify-center gap-2">
                <CoinDisplay coins={10}/>
                <RefillButton/>
                </div>
                </div>
              {children}
            </main>
        </ResizablePanel>
      <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25}>
          <WaterTank waterLevel={0.1} fullTank={0.1}/>
        </ResizablePanel>
      </ResizablePanelGroup>

        </SidebarProvider>
  );
}