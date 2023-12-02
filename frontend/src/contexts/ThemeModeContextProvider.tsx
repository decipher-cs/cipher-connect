import { Theme } from '@mui/material'
import { createContext, PropsWithChildren, useState } from 'react'
import { darkTheme, lightTheme } from '../theme/theme'

type ThemeContext = { theme: Theme; toggleTheme: () => void }

export const ThemeContext = createContext<ThemeContext | null>(null)

export const ThemeModeContextProvider = (props: PropsWithChildren) => {
    const [theme, setTheme] = useState<Theme>(darkTheme)

    const toggleTheme = () => setTheme(prev => (prev === darkTheme ? lightTheme : darkTheme))

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{props.children}</ThemeContext.Provider>
}
