import { Box, Icon } from '@mui/material'
import React from 'react'
import { RoomWithParticipants } from '../types/socket'

interface RoomInfoProps {
    selectedRoom: RoomWithParticipants | undefined
}

export const RoomInfo = (props: RoomInfoProps) => {
    if (props.selectedRoom === undefined) return <>Select a room</>
    return (
        <Box
            sx={{
                border: 'solid blue 3px',
                maxWidth: '20%',
            }}
        >
            {/* Group Image */}
            <Icon />
        </Box>
    )
}
