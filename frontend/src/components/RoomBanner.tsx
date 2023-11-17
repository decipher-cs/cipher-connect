import { ChevronRightRounded } from '@mui/icons-material'
import { Avatar, Box, ButtonGroup, Collapse, IconButton, Typography, useTheme } from '@mui/material'
import { useContext, useState } from 'react'
import { StyledTextField } from './StyledTextField'
import SearchIcon from '@mui/icons-material/Search'
import { CredentialContext } from '../contexts/Credentials'
import { RoomsState } from '../reducer/roomReducer'

export const RoomBanner = (props: { toggleRoomInfoSidebar: () => void; room: RoomsState['joinedRooms'][0] }) => {
    const { username } = useContext(CredentialContext)

    const [searchFieldVisible, setSearchFieldVisible] = useState(false)

    const privateRoomCompanion =
        props.room.roomType === 'private' ? props.room.participants.find(p => p.username !== username) : null

    const displayName =
        props.room.roomType === 'private' ? privateRoomCompanion?.displayName : props.room.roomDisplayName

    const imgSrc = props.room.roomType === 'private' ? privateRoomCompanion?.avatarPath : props.room.roomAvatar

    return (
        <Box
            sx={{
                position: 'absolute',
                left: '0px',
                right: '0px',
                top: '0px',

                // From https://css.glass //
                zIndex: 10,
                background: ({ palette }) =>
                    palette.mode === 'dark' ? 'rgba(100, 100, 100, 0.50)' : 'rgba(255, 255, 255, 0.50)',
                backdropFilter: 'blur(10px)',
                webkitBackdropFilter: 'blur(20px)',

                display: 'grid',
                gridTemplateColumns: 'repeat(2, auto) 1fr',
                alignItems: 'center',
                alignContent: 'center',
            }}
        >
            <IconButton href={imgSrc ?? ''} target='_blank'>
                <Avatar src={imgSrc ?? ''} />
            </IconButton>

            <Typography mx={2}>{displayName}</Typography>

            <ButtonGroup sx={{ justifySelf: 'flex-end', alignItems: 'center' }}>
                <Collapse in={searchFieldVisible} orientation='horizontal'>
                    <StyledTextField size='small' placeholder='Enter to search' sx={{ width: '200px', mr: 1 }} />
                </Collapse>

                <IconButton onClick={() => setSearchFieldVisible(p => !p)}>
                    <SearchIcon />
                </IconButton>

                <IconButton onClick={props.toggleRoomInfoSidebar}>
                    <ChevronRightRounded />
                </IconButton>
            </ButtonGroup>
        </Box>
    )
}
