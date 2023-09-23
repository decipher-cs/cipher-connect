import { ChevronRightRounded } from '@mui/icons-material'
import { Avatar, Box, ButtonGroup, Collapse, IconButton, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { RoomWithParticipants } from '../types/socket'
import { StyledTextField } from './StyledTextField'
import SearchIcon from '@mui/icons-material/Search'
import { CredentialContext } from '../contexts/Credentials'

export const RoomBanner = (props: {
    setRoomInfoVisible: React.Dispatch<React.SetStateAction<boolean>>
    room: RoomWithParticipants
}) => {
    const { username } = useContext(CredentialContext)

    const [searchFieldVisible, setSearchFieldVisible] = useState(false)

    const displayName =
        props.room.isMaxCapacityTwo === true
            ? props.room.participants.find(p => p.username !== username)?.displayName
            : props.room.roomDisplayName

    const otherMemberUsername =
        props.room.isMaxCapacityTwo === true
            ? props.room.participants.find(p => p.username !== username)?.username
            : null

    const imgSrc =
        props.room.isMaxCapacityTwo === true
            ? props.room.participants.find(p => p.username !== username)?.avatarPath
            : import.meta.env.VITE_AVATAR_STORAGE_URL + props.room.roomDisplayImagePath

    console.log(imgSrc)
    return (
        <Box
            sx={{
                position: 'absolute',
                left: '0px',
                right: '0px',
                top: '0px',

                // From https://css.glass //
                background: 'rgba(255, 255, 255, 0.50)',
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

                <IconButton onClick={() => props.setRoomInfoVisible(prev => !prev)}>
                    <ChevronRightRounded />
                </IconButton>
            </ButtonGroup>
        </Box>
    )
}
