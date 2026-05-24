import { useNavigate } from "react-router-dom";
import type { Lp } from "../types/lp";

interface LpCardProps {
    lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
    const navigate = useNavigate();
    return (
        <button
            type="button"
            className="relative group cursor-pointer rounded-lg overflow-hidden"
            onClick={() => navigate(`/lp/${lp.id}`)}
        >
            <img src={lp.thumbnail} alt={lp.title} className="object-cover w-full h-52 transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-white transition-opacity duration-200 p-2 text-center">
                <p className="font-bold line-clamp-2">{lp.title}</p>
                <p className="text-sm mt-1">{new Date(lp.createdAt).toLocaleDateString()}</p>
                <p className="text-sm mt-1">❤️ {lp.likes?.length || 0}</p>
            </div>
        </button>
    )
}

export default LpCard