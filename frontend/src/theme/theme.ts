import { blue, grey, red } from '@mui/material/colors'
import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
    interface TypeBackground {
        dark?: TypeBackground['default']
        light?: TypeBackground['default']
        image?: TypeBackground['default']
    }
    interface Theme {
        design: {
            background: string
            backgroundSize: string
        }
    }
    interface ThemeOptions {
        design?: {
            background?: string
            backgroundSize?: string
        }
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
    design: {
        background: (function () {
            const bg = '#141319'
            const size = 30
            const loopColor = '#18171d'
            const loop = `#0000 46%, ${loopColor} 47% 53%, #0000 54%`

            return `radial-gradient(100% 100% at 100% 101%, ${loop})
                        ${size}px ${size}px,
                        radial-gradient(100% 100% at 0 0, ${loop}) 
                        ${size}px ${size}px,
                        radial-gradient(100% 100%, ${bg} 22%, ${loopColor} 23% 29%, ${bg} 30% 34%, ${loopColor} 35% 41%, #0000 42%)
                        ${bg}`
        })(),
        backgroundSize: (() => {
            const size = 30
            return `${size * 2}px ${size * 2}px`
        })(),
    },
    typography: {
        fontFamily: ['Roboto'].join(','),
    },
    components: {
        MuiButton: { defaultProps: { color: 'primary', size: 'small' } },
        MuiButtonGroup: { defaultProps: { color: 'primary', size: 'small' } },
        MuiToggleButtonGroup: { defaultProps: { color: 'primary', size: 'small' } },
        MuiTextField: { defaultProps: { size: 'small' } },
        MuiListSubheader: { styleOverrides: { sticky: { background: 'transparent' } } },
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
            light: '#faf5f3',
        },
    },
    design: { background: 'linear-gradient(135deg, #f4e9e5,#f4dcd0,#eed0d2,#dbd7e4,#e4e8f2)' },
    typography: {
        fontFamily: ['Roboto'].join(','),
    },
    components: {
        MuiButton: { defaultProps: { color: 'primary', size: 'small' } },
        MuiButtonGroup: { defaultProps: { color: 'primary', size: 'small' } },
        MuiToggleButtonGroup: { defaultProps: { color: 'primary', size: 'small' } },
        MuiTextField: { defaultProps: { size: 'small' } },
        MuiListSubheader: { styleOverrides: { sticky: { background: 'transparent' } } },
    },
})
