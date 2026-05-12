import { useLocalStorage } from "../hooks/useLocalStorage"
import { LOCAL_STORAGE_KEY } from "../constants/key"
import { useEffect } from "react";

const GoogleLoginRedirectPage = () => {
    const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
        const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

        if (accessToken && refreshToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            const redirectUrl = localStorage.getItem("redirectUrl") || "/mypage";
            localStorage.removeItem("redirectUrl");
            window.location.href = redirectUrl;
            return;
        }

        window.location.href = "/login";
    }, [setAccessToken, setRefreshToken]);

    return (
        <div>
            <p>로그인 중입니다.</p>
        </div>
    )
}

export default GoogleLoginRedirectPage