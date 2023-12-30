import { styled, TextField } from '@mui/material'

export const StyledTextField = styled(TextField)(({ theme, variant }) => ({
    '& .MuiInputBase-root': {
        borderRadius: variant === 'standard' ? '0px' : '20px',
        backgroundColor: variant === 'standard' ? 'transparent' : theme.palette.background.light,
    },
    '& .MuiOutlinedInput-root': {
        height: '45px',
    },
}))
