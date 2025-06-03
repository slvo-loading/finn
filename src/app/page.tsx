import { AppSidebar } from "@/components/app-sidebar"

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* left sidebar */}
      <AppSidebar />
      
      {/* text area */}
      <div className="flex-1 bg-pink-300 overflow-hidden">
      </div>

      {/* water popup */}
      <div className="flex flex-col items-center justify-center bg-white h-full w-[16rem]">
        <div className="w-3/4 h-6/7 bg-gray-500"></div>
      </div>
    </div>
  )
}
