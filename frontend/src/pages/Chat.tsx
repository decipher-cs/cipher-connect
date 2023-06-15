import { Button, Dialog, TextField, Typography } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import ChatDisplaySection from '../components/ChatDisplaySection'
import ChatInputBar from '../components/ChatInputBar'
import Sidebar from '../components/Sidebar'
import { CredentialContext } from '../contexts/Credentials'
import { socket } from '../socket'
import { PulseLoader } from 'react-spinners'
import { message as MessageFromDB, room as Room } from '../types/prisma.client'
import AddRoom from '../components/AddRoom'

export type Message = Pick<MessageFromDB, 'senderUsername' | 'content' | 'createdAt' | 'roomId'>

export const generateDummyMessage = (msg: string, sender?: string, roomId?: string): Message => ({
    senderUsername: sender === undefined ? 'undef sender' : sender,
    roomId: roomId === undefined ? 'undef sender' : roomId,
    content: msg,
    createdAt: new Date(),
})

export const Chat = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [chatMessageList, setChatMessageList] = useState<Message[]>([])

    const { username, isLoggedIn } = useContext(CredentialContext)

    const [currRoom, setCurrRoom] = useState<Room>()

    const [rooms, setRooms] = useState<Room[]>([])

    useEffect(() => {
        if (socket.connected === false && isLoggedIn === true) {
            socket.auth = { username }
            socket.connect() // TODO this should be removed in prod. In prod this should run after varifying credentials.
        }

        setIsLoading(false)

        socket.on('privateMessage', (targetRoomId, messageContents, senderUsername) => {
            const msg = generateDummyMessage(messageContents, senderUsername)
            console.log(msg.senderUsername)
            setChatMessageList(prev => prev.concat(msg))
        })

        socket.on('userRoomsUpdated', rooms => {
            setRooms(rooms)
        })

        socket.on('roomChanged', room => {
            if (room !== undefined) setCurrRoom(room)
        })

        socket.on('messagesRequested', messages => {
            setChatMessageList(messages)
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

            <AddRoom
                keyDownActionAddRoom={async newUser => {
                    const myPromise = new Promise<string | null>(resolve =>
                        socket.emit('createNewPrivateRoom', newUser, response => resolve(response))
                    )
                    return await myPromise
                }}
                keyDownActionAddGroup={async newGroupName => {
                    const myPromise = new Promise<string | null>(resolve =>
                        socket.emit('createNewGroup', [username], newGroupName, response => resolve(response))
                    )
                    return await myPromise
                }}
            />

            <Sidebar
                listItems={rooms}
                handleClickOnListDeleteIcon={clickedUsername => {}}
                handleClickOnList={roomDisplayName => {
                    const roomId = rooms.find(room => room.roomDisplayName === roomDisplayName)?.roomId
                    if (roomId !== undefined) {
                        socket.emit('roomSelected', roomId)
                        socket.emit('messagesRequested', roomId)
                    }
                    // {FriendListTextField({ placeholder: "Enter Friend's username" })}
                }}
            />

            {currRoom === undefined ? (
                <div>Select a room/ user</div>
            ) : (
                <ChatDisplaySection chatMessageList={chatMessageList} fakeScrollDiv={fakeScrollDiv} />
            )}

            <ChatInputBar setChatMessageList={setChatMessageList} currRoom={currRoom?.roomId} />
        </>
    )
}
