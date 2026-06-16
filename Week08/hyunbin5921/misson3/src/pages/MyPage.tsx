import { useEffect, useState } from "react"
import { getMyInfo } from "../apis/auth"
import { useAuth } from "../context/AuthContext"
import type { ResponseMyInfoDto } from "../types/auth"


const MyPage = () => {  
    const {logout} = useAuth()
    const [data, setData] =  useState<ResponseMyInfoDto | null>(null)

    useEffect(() => {
        const getData = async ()=>{
            const response = await getMyInfo()
            console.log(response)

            setData(response)
        } 
    getData()
    },[])
    
    const handleLogout = async() => {
        await logout()
    }

  return (
    <div>
        <h1>{data?.data?.name}님 환영합니다</h1>
        <img src={data?.data?.avatar as string} alt="프로필 이미지" />
        <h1>{data?.data?.email}</h1>

        <button className='cursor-pointer bg-blue-300 rounded-sm p-3 hover:scale-95'onClick={handleLogout}>로그아웃</button>
    </div>
  )
}

export default MyPage