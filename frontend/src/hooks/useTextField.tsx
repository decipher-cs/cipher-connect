import { TextField, TextFieldProps } from '@mui/material'
import React, { useState } from 'react'

export const useControlledTextField = (onSubmitHandler: (value: string) => void) => {
    const [value, setValue] = useState('')
    const [error, setError] = useState(false)
    const [helperText, setHelperText] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key.toLowerCase() === 'enter') onSubmitHandler(value)
    }

    const ControlledTextField = (textFieldProps?: TextFieldProps): JSX.Element => {
        return (
            <TextField
                onChange={handleChange}
                value={value}
                helperText={helperText}
                error={error}
                onKeyDown={handleSubmit}
                {...textFieldProps}
            />
        )
    }

    return { value, ControlledTextField, error, setError, helperText, setHelperText }
}
