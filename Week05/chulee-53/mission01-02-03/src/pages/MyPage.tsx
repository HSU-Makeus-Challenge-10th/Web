import { useEffect, useState } from 'react'
import { getMyInfo } from '../api/auth'
import type { ResponseMyInfo } from '../types/auth';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
    const { logout } = useAuth();

    const [data, setData] = useState<ResponseMyInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getMyInfo();
                setData(response);
            } catch (err) {
                setError("정보를 불러오는데 실패했습니다.")
            } finally {
                setIsLoading(false);
            }
        }
        getData();
    }, []);

    const handleLogout = async () => {
        await logout();
    }

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (error || !data) {
        return <div>에러가 발생했습니다.</div>
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