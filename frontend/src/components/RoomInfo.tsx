import {
    Avatar,
    TextField,
    Box,
    Icon,
    Typography,
    IconButton,
    Button,
    Drawer,
    InputAdornment,
    Divider,
    Stack,
    Tooltip,
    Switch,
    ButtonGroup,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Collapse,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { RoomWithParticipants, SocketWithCustomEvents } from '../types/socket'
import { ForwardedRef, forwardRef, Ref, useState } from 'react'
import { imageBufferToURLOrEmptyString } from '../pages/Chat'
import {
    ArrowForwardRounded,
    CancelRounded,
    InfoRounded,
    NotificationsRounded,
    PersonAddRounded,
    SearchSharp,
} from '@mui/icons-material'
import { StyledTextField } from './StyledTextField'
import { EditableText } from './EditableText'
import { Balancer } from 'react-wrap-balancer'

interface RoomInfoProps {
    room: RoomWithParticipants
    socketObject: SocketWithCustomEvents
    setRoomInfoVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const RoomInfo = (props: RoomInfoProps) => {
    const roomType = props.room.isMaxCapacityTwo === true ? 'private' : 'group'

    const [roomAvatar, setRoomAvatar] = useState(imageBufferToURLOrEmptyString(props.room.roomDisplayImage))

    const [roomName, setRoomName] = useState(props.room.roomDisplayName)

    const handleImageUpload = async (fileList: FileList | null) => {
        if (fileList === null || fileList.length === 0) return
        const URL = import.meta.env.PROD ? import.meta.env.VITE_SERVER_PROD_URL : import.meta.env.VITE_SERVER_DEV_URL

        const image = fileList[0]
        const imageFormData = new FormData()
        imageFormData.append('avatar', image)
        imageFormData.append('roomId', props.room.roomId)

        const res = await fetch(`${URL}/updateGroupImage`, {
            method: 'POST',
            body: imageFormData,
            credentials: 'include',
            headers: {
                Accept: 'multipart/form-data',
            },
        })
        if (res.statusText.toLowerCase() === 'ok') {
            const blob = await res.blob()
            const file = new File([blob], 'avatar')
            setRoomAvatar(imageBufferToURLOrEmptyString(file))
        }
    }

    return (
        <Box
            sx={{
                width: 'min(25vw, 450px)',
                height: '100%',

                display: 'grid',
                px: 3,

                overflow: 'visible',
            }}
        >
            <Stack direction='row' sx={{ alignItems: 'center' }}>
                <InfoRounded sx={{ justifySelf: 'flex-start' }} />
                <Typography sx={{ justifySelf: 'flex-start' }}>Room Info</Typography>
                <IconButton
                    onClick={() => props.setRoomInfoVisible(false)}
                    sx={{ justifySelf: 'flex-end', ml: 'auto' }}
                >
                    <CancelRounded />
                </IconButton>
            </Stack>
            <Tooltip title='Click to change image'>
                <IconButton component='label' sx={{ justifySelf: 'center', alignSelf: 'center' }}>
                    <Avatar src={roomAvatar} sx={{ height: 124, width: 124 }} />

                    <input
                        type='file'
                        accept='image/*'
                        hidden
                        onChange={e => {
                            handleImageUpload(e.target.files)
                        }}
                    />
                </IconButton>
            </Tooltip>
            <Typography align='center' variant='h6'>
                {props.room.roomDisplayName}
            </Typography>
            {/* <EditableText text={roomName} setText={setRoomName} /> */}
            <Box sx={{ height: 'fit-content', overflowY: 'auto' }}>
                <Typography>Description:</Typography>
                <Typography variant='body2' paragraph>
                    <Balancer>
                        Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate vvoluptate dolor minim null
                        aoluptate dolor minim nullavoluptate dolor minim null
                    </Balancer>
                </Typography>
            </Box>
            <Divider />
            <Stack direction='row' alignItems='center'>
                <NotificationsRounded />
                Notifications
                <Switch sx={{ ml: 'auto' }} />
            </Stack>
            <Divider />
            <Stack direction='row' sx={{ alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Typography noWrap>Members ({props.room.participants.length})</Typography>
                {roomType === 'group' ? <CollapsibleInput socketObject={props.socketObject} room={props.room} /> : null}
            </Stack>
            <List dense sx={{ maxHeight: '220px', overflow: 'auto' }}>
                {props.room.participants.map(({ username }, i) => (
                    <ListItem key={i}>
                        <ListItemAvatar>
                            <Avatar sizes='14px' sx={{ height: '24px', width: '24px' }} src='' />
                        </ListItemAvatar>
                        <ListItemText>{username}</ListItemText>
                    </ListItem>
                ))}
            </List>
            {props.room.isMaxCapacityTwo === false ? (
                <ButtonGroup size='small' variant='text'>
                    <Button fullWidth onClick={() => {}}>
                        Delete Group
                    </Button>
                    <Button fullWidth onClick={() => {}}>
                        Leave Group
                    </Button>
                </ButtonGroup>
            ) : null}
        </Box>
    )
}

const CollapsibleInput = (props: { socketObject: SocketWithCustomEvents; room: RoomWithParticipants }) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const [contactFieldValue, setContactFieldValue] = useState('password')

    const [contactFieldHelperText, setContactFieldHelperText] = useState('')

    return (
        <>
            <IconButton onClick={() => setIsCollapsed(p => !p)}>
                <PersonAddRounded />
            </IconButton>
            <Collapse in={!isCollapsed} sx={{ flexBasis: '100%' }}>
                <StyledTextField
                    size='small'
                    sx={{ width: '100%' }}
                    onChange={e => {
                        setContactFieldValue(e.target.value)
                        if (contactFieldHelperText !== '') setContactFieldHelperText('')
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter')
                            props.socketObject.emit(
                                'addParticipantsToGroup',
                                [contactFieldValue],
                                props.room.roomId,
                                response => {
                                    setContactFieldHelperText(response)
                                }
                            )
                    }}
                    value={contactFieldValue}
                    helperText={contactFieldHelperText}
                    placeholder='Add contact'
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton onClick={() => {}}>
                                    <ArrowForwardRounded />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Collapse>
        </>
    )
}
