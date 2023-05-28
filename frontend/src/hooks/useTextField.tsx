import { TextField, TextFieldProps } from '@mui/material'
import React, { useState } from 'react'

export const useControlledTextField = (onSubmitHandler: ()=>void) => {
    const [value, setValue] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key.toLowerCase() === 'enter') onSubmitHandler()
    }

    const ControlledTextField = (textFieldProps?: TextFieldProps): JSX.Element => {
        return <TextField onChange={handleChange} value={value} onKeyDown={handleSubmit} {...textFieldProps} />
    }

    return { value, ControlledTextField }
}
