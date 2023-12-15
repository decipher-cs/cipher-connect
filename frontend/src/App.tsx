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
import axios from 'axios'
import { AuthenticationContextProvider } from './contexts/AuthenticationContext'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Pages } from './components/Pages'
import { useDarkModeToggle } from './hooks/useDarkModeToggle'
import { useDialog } from './hooks/useDialog'

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

    const { dialogOpen, handleClose } = useDialog(true)

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                {import.meta.env.PROD && (
                    <Dialog open={dialogOpen}>
                        <DialogTitle>App Under Development </DialogTitle>
                        <DialogContent dividers>
                            This app is still being worked on. Some features might be unavailable. Some missing
                            features:
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
                )}
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
