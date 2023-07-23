import { Avatar, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { room } from '../types/prisma.client'
import { RoomWithParticipants } from '../pages/Chat'
import { useContext } from 'react'
import { CredentialContext } from '../contexts/Credentials'

interface MessageListItemProps {
    rooms: RoomWithParticipants[]
}

const MessageListItem = () => {
    return (
        <>
            <ListItem>
                <ListItemIcon>
                    <Avatar />
                </ListItemIcon>
                <ListItemText primary={<>name</>} secondary={<>subtext</>} />
            </ListItem>
        </>
    )
}

interface MessageSidebarProps {
    rooms: RoomWithParticipants[]
}

export const MessageSidebar = (props: MessageSidebarProps) => {
    const { username } = useContext(CredentialContext)
    return (
        <Box
            sx={{
                border: 'solid red 3px',
                maxWidth: '30%',
            }}
        >
            <List>
                {props.rooms.map((room, i) => {
                    // <MessageListItem key={i} />
                    let displayName
                    if (room.isMaxCapacityTwo === true) {
                        displayName = room.participants.find(({ username: participantUsername }) => participantUsername !== username)?.username
                    } else {
                        displayName = room.roomDisplayName
                    }
                    return (
                            <ListItem key={i}>
                                <ListItemIcon>
                                    <Avatar />
                                </ListItemIcon>
                                <ListItemText primary={<>{displayName}</>} secondary={<>subtext</>} />
                            </ListItem>
                    )
                })}
            </List>
        </Box>
    )
}
