import { blue } from '@mui/material/colors'
import { createTheme } from '@mui/material'

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: blue[600] },
    },
    typography: {
        fontFamily: ['Roboto'].join(','),
    },
})
