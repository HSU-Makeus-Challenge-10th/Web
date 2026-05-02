import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";

const ThemeContent = () => {
    const { toggleTheme, theme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;
    return (
        <div className={clsx("p-4 h-dvh", isLightMode ? "bg-gray-200 text-black" : "bg-gray-800 text-white")}>
            <h1 className={clsx("text-2xl font-bold", isLightMode ? "text-black" : "text-white")}>ThemeContent</h1>
            <p className={clsx("mt-2", isLightMode ? "text-black" : "text-white")}>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus rem fugit, nisi exercitationem aliquid ut praesentium iusto laborum error, debitis quo atque blanditiis quis temporibus facere a doloremque quos corporis!
            </p>
        </div>
    )
}

export default ThemeContent