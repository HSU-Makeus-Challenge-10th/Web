import { useEffect, useState } from 'react'
import { getMyInfo } from '../api/auth'
import type { ResponseMyInfo } from '../types/auth';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
    const { logout } = useAuth();

    const [data, setData] = useState<ResponseMyInfo | null>(null);

    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();
            setData(response);
        }
        getData();
    }, []);

    const handleLogout = async () => {
        await logout();

    }

    if (!data) {
        return <div>로딩 중...</div>;
    }

    return (
        <div>
            <img src={data?.data?.avatar ?? ""} alt="" />
            <p>{data?.data?.name ?? ""}</p>
            <p>{data?.data?.email ?? ""}</p>

            <button onClick={handleLogout}>로그아웃</button>
        </div>
    )
}

export default MyPage