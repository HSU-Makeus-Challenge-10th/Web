import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleLoginRedirectPage = () => {
    const navigate = useNavigate();
    const { setAccessToken, setAccessTokenInStorage } = useAuth();

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("accessToken");

        if (accessToken) {
            setAccessToken(accessToken);
            setAccessTokenInStorage(accessToken);
            
            const redirectUrl = localStorage.getItem("redirectUrl") || "/mypage";
            localStorage.removeItem("redirectUrl");
            
            navigate(redirectUrl, { replace: true });
            return;
        }

        navigate("/login", { replace: true });
    }, [navigate, setAccessToken, setAccessTokenInStorage]);

    return (
        <div>
            <p>로그인 중입니다.</p>
        </div>
    );
};

export default GoogleLoginRedirectPage;
