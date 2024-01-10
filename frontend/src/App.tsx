import {
    Button,
    createTheme,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    List,
    ListItem,
    ListSubheader,
    ThemeProvider,
    Typography,
} from '@mui/material'
import { AuthenticationContextProvider } from './contexts/AuthenticationContext'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Pages } from './components/Pages'
import { useDarkModeToggle } from './hooks/useDarkModeToggle'
import { useDialog } from './hooks/useDialog'
import { useEffect } from 'react'
import axios, { AxiosError, isAxiosError } from 'axios'
import { ToastContextProvider } from './contexts/ToastContextProvider'
import { enableMapSet } from 'immer'

enableMapSet()

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
    timeout: 1000 * 60,
    retryDelayInMs: 1000 * 60,
})

const App = () => {
    const { theme } = useDarkModeToggle()

    useEffect(() => {
        const intercepter = axiosServerInstance.interceptors.response.use(undefined, async interceptedError => {
            if (isAxiosError(interceptedError)) {
                const { config, message, name } = interceptedError

                if (!config?.retry || config.retry <= 0 || name.toLowerCase() === 'CanceledError'.toLowerCase()) {
                    return Promise.reject(interceptedError)
                }

                config.retry -= 1

                if (!config.retryDelayInMs) config.retryDelayInMs = 1000
                else config.retryDelayInMs *= 2

                const delayRetryRequest = new Promise(resolve => {
                    import.meta.env.DEV &&
                        console.warn(
                            `retring "${config.url}" in ${(config.retryDelayInMs ?? 1000) / 1000} sec. Retring ${
                                config.retry
                            } more times. Fail reason: "${name}" Fail message: "${message}"`
                        )
                    setTimeout(() => {
                        resolve('')
                    }, config.retryDelayInMs)
                })

                return delayRetryRequest.then(() => axiosServerInstance(config))
            }
            return Promise.reject(interceptedError)
        })

        return () => {
            axiosServerInstance.interceptors.response.eject(intercepter)
        }
    }, [axiosServerInstance])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <>
                    <WarningDialog />
                    <ToastContextProvider>
                        <QueryClientProvider client={queryClient}>
                            <AuthenticationContextProvider>
                                <Pages />
                            </AuthenticationContextProvider>
                        </QueryClientProvider>
                    </ToastContextProvider>
                </>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App

const WarningDialog = () => {
    const { dialogOpen, handleClose } = useDialog(true)

    if (import.meta.env.DEV) return null

    return (
        <Dialog open={dialogOpen}>
            <DialogTitle>App Under Development </DialogTitle>
            <DialogContent dividers>
                This app is still being worked on. Some features might be unavailable. Some missing features:
                <List>
                    <ListItem>- Read receipt</ListItem>
                    <ListItem>- Statefull dialogs (like this one)</ListItem>
                    <ListItem>- Blocking User, etc</ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={handleClose}>
                    Acknowledge
                </Button>
            </DialogActions>
        </Dialog>
    )
}
