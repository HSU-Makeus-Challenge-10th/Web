import { useAuth } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedLayout = () => {
    const { accessToken } = useAuth()

    if (!accessToken) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans">
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <Outlet />
            </div>
        </div>
    )
}

export default ProtectedLayout