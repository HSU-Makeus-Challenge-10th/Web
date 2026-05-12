import { useLocalStorage } from "../hooks/useLocalStorage"
import { LOCAL_STORAGE_KEY } from "../constants/key"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleLoginRedirectPage = () => {
    const navigate = useNavigate();
    const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);

        if (accessToken) {
            setAccessToken(accessToken);
            const redirectUrl = localStorage.getItem("redirectUrl") || "/mypage";
            localStorage.removeItem("redirectUrl");
            navigate(redirectUrl, {replace: true});
            return;
        }

        navigate("/login", {replace: true});
    }, [navigate, setAccessToken]);

    return (
        <div>
            <p>로그인 중입니다.</p>
        </div>
    )
}

export default GoogleLoginRedirectPage