import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-[#141517]">
            <Link to="/" className="text-[#FF1E90] text-xl font-bold">
                돌려돌려LP판
            </Link>
            <div className="flex gap-4 items-center">
                <Link to="/login" className="text-white hover:text-gray-300 text-sm font-semibold">로그인</Link>
                <Link to="/signup" className="bg-[#FF1E90] text-white px-4 py-2 rounded-md font-semibold text-sm">회원가입</Link>
            </div>
        </nav>
    );
};

export default Navbar;