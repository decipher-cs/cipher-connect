import React, { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeModeContextProvider'

export const useDarkModeToggle = () => {
    const themeContext = useContext(ThemeContext)

    if (!themeContext) throw new Error('Cannot use theme out of context provider')

    const { theme, toggleTheme } = themeContext

    return { theme, toggleTheme }
}
