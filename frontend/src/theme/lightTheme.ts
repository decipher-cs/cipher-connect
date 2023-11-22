import { createTheme } from '@mui/material'

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2c98ca',
            light: '#45a3ec',
            dark: '#108ca6',
        },
    },
    typography: {
        fontFamily: ['Roboto'].join(','),
    },
    components: {
        MuiButton: { defaultProps: { color: 'primary', size: 'small' } },
        MuiButtonGroup: { defaultProps: { color: 'primary', size: 'small' } },
        MuiToggleButtonGroup: { defaultProps: { color: 'primary', size: 'small' } },
        MuiTextField: { defaultProps: { size: 'small' } },
    },
})
