import { createTheme, CssBaseline, LinearProgress, ThemeProvider } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ThemeContext, ThemeModeContextProvider } from './contexts/ThemeModeContextProvider'
import { AuthenticationContextProvider } from './contexts/AuthenticationContext'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Pages } from './components/Pages'
import { useDarkModeToggle } from './hooks/useDarkModeToggle'

if (!import.meta.env.VITE_SERVER_URL) throw new Error('Server URL not provided to the app.')

export const queryClient = new QueryClient()

export const axiosServerInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
})

const App = () => {
    const { theme } = useDarkModeToggle()

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <QueryClientProvider client={queryClient}>
                    <AuthenticationContextProvider>
                        <Pages />
                    </AuthenticationContextProvider>
                </QueryClientProvider>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App
