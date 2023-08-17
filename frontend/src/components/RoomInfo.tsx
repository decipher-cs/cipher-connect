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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { RoomWithParticipants, SocketWithCustomEvents } from '../types/socket'
import { ForwardedRef, forwardRef, Ref, useState } from 'react'
import { imageBufferToURLOrEmptyString } from '../pages/Chat'
import { ArrowForwardRounded, CancelRounded, InfoRounded, SearchSharp } from '@mui/icons-material'
import { StyledTextField } from './StyledTextField'
import { EditableText } from './EditableText'
import { Balancer } from 'react-wrap-balancer'

interface RoomInfoProps {
    room: RoomWithParticipants
    socketObject: SocketWithCustomEvents
    setRoomInfoVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const RoomInfo = (props: RoomInfoProps) => {
    const [contactFieldValue, setContactFieldValue] = useState('password')

    const [contactFieldHelperText, setContactFieldHelperText] = useState('')

    const roomType = props.room.isMaxCapacityTwo === true ? 'private' : 'group'

    const [roomAvatar, setRoomAvatar] = useState(imageBufferToURLOrEmptyString(props.room.roomDisplayImage))

    const [roomName, setRoomName] = useState(props.room.roomDisplayName)

    const [roomNameHelperText, setRoomNameHelperText] = useState('')

    const [isTextFieldEnabled, setIsTextFieldEnabled] = useState(false)

    const handleRoomNameChange = () => {}
    const handleRoomNameSubmit = () => {}

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
                width: 'min(30vw, 450px)',
                height: '100%',

                display: 'grid',
                px: 3,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'flex-start',

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
            <Divider />
            <Tooltip title='Click to change image'>
                <IconButton component='label' sx={{ justifySelf: 'center' }}>
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
            {/* <Box onClick={() => setIsTextFieldEnabled(p => !p)} sx={{ width: 'max-content' }}> */}
            {/*     {isTextFieldEnabled ? ( */}
            {/*         <Typography>{roomName}</Typography> */}
            {/*     ) : ( */}
            {/*         <StyledTextField */}
            {/*             size='small' */}
            {/*             value={roomName} */}
            {/*             helperText={roomNameHelperText} */}
            {/*             onChange={e => { */}
            {/*                 setRoomName(e.target.value) */}
            {/*                 if (e.target.value.trim() !== props.room.roomDisplayName) { */}
            {/*                     setRoomNameHelperText('Submit to change room name') */}
            {/*                 } else setRoomNameHelperText('') */}
            {/*             }} */}
            {/*             // InputProps={{ */}
            {/*             //     endAdornment: ( */}
            {/*             //         <InputAdornment position='end'> */}
            {/*             //             <IconButton onClick={() => {}}> */}
            {/*             //                 <ArrowForwardRounded /> */}
            {/*             //             </IconButton> */}
            {/*             //         </InputAdornment> */}
            {/*             //     ), */}
            {/*             // }} */}
            {/*         /> */}
            {/*     )} */}
            {/* </Box> */}
            <EditableText text={roomName} setText={setRoomName} />
            <Box sx={{ maxHeight: '40%', overflowY: 'auto' }}>
                <Typography>Description:</Typography>
                <Typography variant='body2' paragraph>
                    <Balancer>
                        Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate vvoluptate dolor minim null
                        aoluptate dolor minim nullavoluptate dolor minim null
                    </Balancer>
                </Typography>
            </Box>
            <Divider />
            Notifications <Switch />
            <Divider />
            <Box>
                Members ({props.room.participants.length})
                {roomType === 'group' && (
                    <>
                        <IconButton>
                            <AddIcon />
                        </IconButton>
                        <StyledTextField
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
                    </>
                )}
            </Box>
            <Box>
                <Divider />
                <List>
                    {props.room.participants.map(({ username }, i) => (
                        <ListItem key={i}>
                            <ListItemAvatar>
                                <Avatar src='' />
                            </ListItemAvatar>
                            <ListItemText>{username}</ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Box>
            {props.room.isMaxCapacityTwo === false ? (
                <>
                    <Divider />
                    <ButtonGroup size='small' variant='text'>
                        <Button onClick={() => {}}>Delete Group</Button>
                        <Button onClick={() => {}}>Leave Group</Button>
                    </ButtonGroup>
                </>
            ) : null}
        </Box>
    )
}
