import { styled, TextField } from '@mui/material'

export const StyledTextField = styled(TextField)(({ theme }) => ({
    borderRadius: '20px',
    '& .MuiInputBase-root': {
        borderRadius: '20px',
    },
}))
