import { createContext, useContext, useState, type PropsWithChildren } from "react"

export type TTheme = 'LIGHT' | 'DARK'

interface IThemeContext {
    theme: TTheme
    toggleTheme: () => void
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined)

export const ThemeProvider = ({children}: PropsWithChildren) => {
    const [theme, setTheme] = useState<TTheme>('LIGHT')
    
    const toggleTheme = () =>{
        setTheme(prev => (prev === 'LIGHT' ? 'DARK' : 'LIGHT'))
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}