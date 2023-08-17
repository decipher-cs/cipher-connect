import { blue, pink, red } from '@mui/material/colors'
import { createTheme } from '@mui/material'

export const lightMod = createTheme({
    palette: {
        primary: {
            main: blue[600],
        },
    },
    typography: {
        fontFamily: ['Roboto'].join(','),
    },
})
