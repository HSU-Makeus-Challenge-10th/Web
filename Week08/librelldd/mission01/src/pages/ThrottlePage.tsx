import { useEffect, useState } from "react";
import useThrottle from "../hooks/useThrottle";

const ThrottlePage = () => {
    const [scrollY, setScrollY] = useState<number>(0);

    const throttledScrollY = useThrottle(scrollY, 1000);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []); 

    console.log("리렌더링");

    return (
      
        <div className="h-[300vh] flex flex-col items-center justify-center">
            <div className="fixed top-10 left-10 bg-white p-4 border rounded-md">
                <h1>쓰로톨링이 무엇일까요?</h1>
                <p>ScrollY: {throttledScrollY}px</p> 
            </div>
        </div>
    );
};

export default ThrottlePage;