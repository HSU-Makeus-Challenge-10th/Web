import { THEME, useTheme } from "./ThemeProvider"
import clsx from "clsx"

const ThemeToggleButton = () => {
    const { toggleTheme, theme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;
    return (
        <button className={clsx("px-4 py-2 mt-4 rounded-full transition-all cursor-pointer", isLightMode ? "bg-white text-black" : "bg-black text-white")} onClick={toggleTheme}>{isLightMode ? "☀️ 라이트 모드" : "🌙 다크 모드"}</button>
    )
}

export default ThemeToggleButton