import clsx from "clsx";
import ThemeToggleButton from "./ThemeToggleButton";
import { useTheme } from "../context/ThemeProvider";

export default function Navber() {
    const {theme} = useTheme()

    const isLightMode = theme === 'LIGHT'
  return(
  <nav className={clsx(
    'p-4 w-full flex justify-end',
    isLightMode ? 'bg-white': 'bg-gray-800'
  )}>
    <ThemeToggleButton />
  </nav>
  )
}