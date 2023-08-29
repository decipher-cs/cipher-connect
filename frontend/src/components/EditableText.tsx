import { ArrowForwardRounded, EditOff, EditOffRounded, EditRounded } from '@mui/icons-material'
import {
    Box,
    FilledInput,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Input,
    InputAdornment,
    InputBase,
    InputLabel,
    InputProps,
    OutlinedInput,
    Switch,
    TextField,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'

export const EditableText = ({
    text,
    setText,
    inputProps,
}: {
    text: string
    setText: (value: React.SetStateAction<string>) => void
    inputProps?: InputProps
}) => {
    const [isEditing, setIsEditing] = useState(false)

    // const handleTextClick = () => setIsEditing(true)

    // const handleInputBlur = () => setIsEditing(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
        // if (event.target.value.trim() !== props.room.roomDisplayName) {
        //     setRoomNameHelperText('Submit to change room name')
        // } else setRoomNameHelperText('')
        // console.log(inputProps.onChange)
    }

    const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) =>
        event.key === 'Enter' && setIsEditing(false)

    return (
        <Box sx={{}}>
            {isEditing ? (
                <Input
                    {...inputProps}
                    value={text}
                    onChange={handleInputChange}
                    // onBlur={handleInputBlur}
                    onKeyPress={handleInputKeyPress}
                    autoFocus
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton onClick={() => {}}>
                                <ArrowForwardRounded />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            ) : (
                <Typography
                    align='center'
                    variant='body1'
                    // onClick={handleTextClick}
                >
                    {text}
                </Typography>
            )}
            {/* <Switch */}
            {/*     checked={isEditing} */}
            {/*     onChange={() => setIsEditing(p => !p)} */}
            {/*     icon={<EditRounded />} */}
            {/*     checkedIcon={<EditOffRounded />} */}
            {/*     inputProps={{ role: 'switch' }} */}
            {/* /> */}
        </Box>
    )
}
