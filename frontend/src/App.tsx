import { createTheme, CssBaseline, LinearProgress, ThemeProvider } from '@mui/material'
import axios from 'axios'
import { AuthenticationContextProvider } from './contexts/AuthenticationContext'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Pages } from './components/Pages'
import { useDarkModeToggle } from './hooks/useDarkModeToggle'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
            networkMode: import.meta.env.DEV ? 'always' : 'online',
        },
    },
})

export const axiosServerInstance = axios.create({
    baseURL: '/api',
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
