import { Outlet } from "react-router-dom"
import { NavBar } from "../components/NavBar"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="px-5 md:px-8 py-6">
        <Outlet />
      </div>
    </main>
  )
}