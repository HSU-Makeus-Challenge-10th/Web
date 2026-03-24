import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";

export default function ThemeContent() {
  const { theme, toggleTheme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;
  return (
    <div
      className={clsx(
        "p-4 h-dvh w-full",
        isLightMode ? "bg-white" : "bg-gray-800",
      )}
    >
      <h1
        className={clsx(
          "text-wxl font-bold",
          isLightMode ? "text-black" : "text-white",
        )}
      >
        Theme Content
      </h1>
      <p className={clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </div>
  );
}
