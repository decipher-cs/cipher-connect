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
            default: '#1c1c24',
            dark: '#18171d',
            light: '#141319',
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
