import ThemeToggleButton from "./context/ThemeToggleButton";
import { THEME, useTheme } from "./context/ThemeProvider";
import clsx from "clsx";

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;
    return (
        <nav className={clsx("p-4 w-full flex justify-end", isLightMode ? "bg-gray-200 text-black" : "bg-gray-800 text-white")}>
            <ThemeToggleButton />
        </nav>
    )
}

export default Navbar