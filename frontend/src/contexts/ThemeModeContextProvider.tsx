import { Theme } from '@mui/material'
import { createContext, PropsWithChildren, useState } from 'react'
import { darkTheme } from '../theme/darkTheme'
import { lightTheme } from '../theme/lightTheme'

export const ThemeContext = createContext({ theme: darkTheme, toggleTheme: () => {} })

export const ThemeModeContextProvider = (props: PropsWithChildren) => {
    const [theme, setTheme] = useState<Theme>(darkTheme)

    const toggleTheme = () => setTheme(prev => (prev === darkTheme ? lightTheme : darkTheme))

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{props.children}</ThemeContext.Provider>
}
