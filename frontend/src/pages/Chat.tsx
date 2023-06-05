import { Button, Typography } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import ChatDisplaySection from '../components/ChatDisplaySection'
import ChatInputBar from '../components/ChatInputBar'
import TemporaryDrawer from '../components/TemporaryDrawer'
import { CredentialContext } from '../contexts/Credentials'
import { useControlledTextField } from '../hooks/useTextField'
import { socket } from '../socket'
import { PulseLoader } from 'react-spinners'
import { room } from '../types/prisma.client'

// const generateDummyMessage = (msg?: string): Message => ({
//     uuid: crypto.randomUUID(),
//     sender: 'anon',
//     time: new Date(),
//     text: msg === undefined ? 'sample' : msg,
// })

// const sampleMsg = [generateDummyMessage()]

export const Chat = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [chatMessageList, setChatMessageList] = useState<string[]>(['hello world'])

    const { username, isLoggedIn } = useContext(CredentialContext)

    const [currRoom, setCurrRoom] = useState<room>()

    const [rooms, setRooms] = useState<room[]>([])

    const {
        setError,
        setHelperText,
        ControlledTextField: FriendListTextField,
    } = useControlledTextField(participantName => {
        socket.emit('createNewRoom', participantName, response => {
            if (response === null) {
                setError(false)
                setHelperText('')
            } else {
                setError(true)
                setHelperText(response)
            }
        })
    })

    useEffect(() => {
        if (socket.connected === false && isLoggedIn === true) {
            socket.auth = { username }
            socket.connect() // TODO this should be removed in prod. In prod this should run after varifying credentials.
        }

        setIsLoading(false)

        socket.on('privateMessage', msg => {
            // setChatMessageList(prev => prev.concat(generateDummyMessage(msg)))
            setChatMessageList(prev => prev.concat(msg))
        })

        socket.on('userRoomsUpdated', rooms => {
            setRooms(rooms)
        })

        socket.on('roomChanged', room => {
            if (room !== undefined) setCurrRoom(room)
        })

        return () => {
            socket.removeAllListeners()
            if (socket.connected === true) {
                socket.disconnect()
            }
        }
    }, [])

    const fakeScrollDiv = useRef<HTMLDivElement | null>(null)

    if (isLoading) return <PulseLoader color='#36d7b7' />

    return (
        <>
            <Typography variant='subtitle1'>{currRoom === undefined ? 'undef' : currRoom.roomDisplayName}</Typography>

            {rooms.map(({ roomDisplayName }, i) => (
                <Button
                    key={i}
                    onClick={() => {
                        const roomId = rooms.find(room => room.roomDisplayName === roomDisplayName)?.roomId
                        if (roomId !== undefined) {
                            socket.emit('roomSelected', roomId)
                        }
                    }}
                >
                    {roomDisplayName}
                </Button>
            ))}
            {/* <TemporaryDrawer */}
            {/*     listItems={rooms.map(({ roomDisplayName }) => roomDisplayName)} */}
            {/**/}
            {/*     handleClickOnList={roomDisplayName => { */}
            {/*         const roomId = rooms.find(room => room.roomDisplayName === roomDisplayName)?.roomId */}
            {/*         if (roomId !== undefined) socket.emit('roomSelected', roomId) */}
            {/*     }} */}
            {/**/}
            {/*     handleClickOnListIcon={clickedUsername => {}} */}
            {/* > */}
            {/*     {FriendListTextField({ placeholder: "Enter Friend's username" })} */}
            {/* </TemporaryDrawer> */}

            <ChatDisplaySection chatMessageList={chatMessageList} fakeScrollDiv={fakeScrollDiv} />

            <ChatInputBar setChatMessageList={setChatMessageList} currRoom={currRoom?.roomId} />
        </>
    )
}
