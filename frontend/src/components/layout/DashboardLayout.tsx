import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#0e0e10] overflow-hidden">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
