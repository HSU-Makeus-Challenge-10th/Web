
import { createContext, useState, useContext, type PropsWithChildren } from "react";


export const THEME = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
} as const;

type TTheme = typeof THEME.LIGHT | typeof THEME.DARK;

interface IThemeContext {
    theme: TTheme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

// 3. JSX.Element 대신 React.ReactElement를 쓰거나 타입을 생략하면 네임스페이스 에러가 사라져요.
export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

    const toggleTheme = () => {
        setTheme((prevTheme) =>
            prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
        );
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};