import { ChevronRightRounded } from '@mui/icons-material'
import { Avatar, Box, ButtonGroup, Collapse, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import { imageBufferToURLOrEmptyString } from '../pages/Chat'
import { RoomWithParticipants } from '../types/socket'
import { StyledTextField } from './StyledTextField'
import SearchIcon from '@mui/icons-material/Search'

export const RoomBanner = (props: {
    setRoomInfoVisible: React.Dispatch<React.SetStateAction<boolean>>
    room: RoomWithParticipants
}) => {
    const [searchFieldVisible, setSearchFieldVisible] = useState(false)

    return (
        <Box
            sx={{
                position: 'absolute',
                left: '0px',
                right: '0px',
                top: '0px',

                // From https://css.glass //
                background: 'rgba(255, 255, 255, 0.80)',
                backdropFilter: 'blur(10px)',
                webkitBackdropFilter: 'blur(20px)',

                display: 'grid',
                gridTemplateColumns: 'repeat(2, auto) 1fr',
                alignItems: 'center',
                alignContent: 'center',
            }}
        >
            <IconButton href={imageBufferToURLOrEmptyString(props.room.roomDisplayImage)} target='_blank'>
                <Avatar src={imageBufferToURLOrEmptyString(props.room.roomDisplayImage)} />
            </IconButton>

            <Typography>{props.room.roomDisplayName}</Typography>

            <ButtonGroup sx={{ justifySelf: 'flex-end', alignItems: 'center' }}>
                <IconButton onClick={() => setSearchFieldVisible(p => !p)}>
                    <SearchIcon />
                </IconButton>

                <Collapse in={searchFieldVisible} orientation='horizontal'>
                    <StyledTextField size='small' />
                </Collapse>

                <IconButton onClick={() => props.setRoomInfoVisible(prev => !prev)}>
                    <ChevronRightRounded />
                </IconButton>
            </ButtonGroup>
        </Box>
    )
}
