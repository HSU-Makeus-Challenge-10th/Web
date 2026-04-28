import { useEffect, useState } from 'react'
import { getMyInfo } from '../api/auth'
import type { ResponseMyInfo } from '../types/auth';

const MyPage = () => {
    const [data, setData] = useState<ResponseMyInfo | null>(null);

    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();
            setData(response);
        }
        getData();
    }, [])

    if (!data) {
        return <div>로딩 중...</div>;
    }

    return (
        <div>
            <p>{data.data?.name}</p>
            <p>{data.data?.email}</p>
        </div>
    )
}

export default MyPage