import { blue, grey, red } from '@mui/material/colors'
import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
    interface TypeBackground {
        dark?: TypeBackground['default']
        light?: TypeBackground['default']
    }
}

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#2c98ca',
            light: '#45a3ec',
            dark: '#108ca6',
        },
        background: {
            dark: '#141319',
            default: '#18171d',
            light: '#1c1c24',
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

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2c98ca',
            light: '#45a3ec',
            dark: '#108ca6',
        },
        background: {
            default: '#ffffff',
            // dark: 'red',
            light: '#faf5f3',
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
