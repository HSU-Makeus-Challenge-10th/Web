import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

const Layout = () => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
