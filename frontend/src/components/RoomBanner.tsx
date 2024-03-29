import {
    ArrowRightRounded,
    ArrowLeftRounded,
    ChevronRightRounded,
    CancelRounded,
    ClearRounded,
} from '@mui/icons-material'
import {
    alpha,
    Avatar,
    Box,
    ButtonGroup,
    Collapse,
    Divider,
    IconButton,
    InputAdornment,
    Typography,
    useTheme,
} from '@mui/material'
import { RefObject, useContext, useEffect, useRef, useState } from 'react'
import { StyledTextField } from './StyledTextField'
import SearchIcon from '@mui/icons-material/Search'
import { RoomsState } from '../reducer/roomReducer'
import Mark from 'mark.js'
import '../mark.css'
import { useAuth } from '../hooks/useAuth'

export const RoomBanner = ({
    searchContainerRef,
    users,
    ...props
}: {
    toggleRoomInfoSidebar: () => void
    users: RoomsState['usersInfo']
    room: RoomsState['joinedRooms'][0]
    searchContainerRef: React.RefObject<HTMLElement>
}) => {
    const {
        authStatus: { username, isLoggedIn },
    } = useAuth()

    const [searchFieldVisible, setSearchFieldVisible] = useState(false)

    const privateRoomCompanion =
        props.room.roomType === 'private'
            ? props.room.participants.find(participantUsername => participantUsername !== username)
            : null

    const displayName =
        props.room.roomType === 'private' ? users[privateRoomCompanion ?? '']?.displayName : props.room.roomDisplayName

    const imgSrc =
        props.room.roomType === 'private' ? users[privateRoomCompanion ?? '']?.avatarPath : props.room.roomAvatar

    const [searchTerm, setSearchTerm] = useState('')

    const highlightedElements = useRef<Element[]>([])

    const [totalSearchHits, setTotalSearchHits] = useState(0)

    const [currHighlightIndex, setCurrHighlightIndex] = useState(0)

    const incrementCurrIndex = () => setCurrHighlightIndex(p => (p >= totalSearchHits - 1 ? 0 : p + 1))

    const decrementCurrIndex = () => setCurrHighlightIndex(p => (p === 0 ? totalSearchHits - 1 : p - 1))

    useEffect(() => {
        if (!searchContainerRef || !searchContainerRef.current) return

        if (!(searchContainerRef.current instanceof HTMLElement)) return

        const mark = new Mark(searchContainerRef.current)

        highlightedElements.current = []

        mark.unmark()

        mark.mark(searchTerm, {
            each: element => highlightedElements.current.push(element),
            done(marksTotal) {
                setTotalSearchHits(marksTotal)
                setCurrHighlightIndex(marksTotal - 1)
            },
        })
    }, [searchTerm, searchContainerRef?.current])

    useEffect(() => {
        if (!searchContainerRef || !searchContainerRef.current || highlightedElements.current.length === 0) return

        const currElem = highlightedElements.current.at(currHighlightIndex)

        if (!currElem) return

        currElem.classList.add('focused-mark')
        currElem.scrollIntoView({ behavior: 'smooth', block: 'center' })

        return () => {
            currElem?.classList.remove('focused-mark')
        }
    }, [currHighlightIndex])

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
                    palette.mode === 'dark'
                        ? alpha(palette?.background?.light ?? '#000', 0.85)
                        : 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(10px)',
                webkitBackdropFilter: 'blur(20px)',
                boxShadow: 'rgba(0, 0, 0, 0.50)  0px 0px 0px 0px',

                display: 'grid',
                gridTemplateColumns: 'repeat(2, auto) 1fr',
                alignItems: 'center',
                alignContent: 'center',
                height: 70,
            }}
        >
            <IconButton onClick={props.toggleRoomInfoSidebar}>
                <Avatar src={imgSrc ?? ''} />
            </IconButton>

            <Typography mx={2}>{displayName}</Typography>

            <ButtonGroup
                sx={{
                    justifySelf: 'flex-end',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}
            >
                <Collapse in={searchFieldVisible} orientation='horizontal' autoFocus sx={{ mr: 2 }}>
                    <StyledTextField
                        autoFocus
                        placeholder='Enter to search'
                        sx={{ width: '350px' /*TODO: use relative width without breaking animation*/ }}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={e => (e.key.toLowerCase() === 'enter' ? incrementCurrIndex() : null)}
                        value={searchTerm}
                        InputProps={{
                            endAdornment: (
                                <>
                                    <Typography color='grey'>
                                        {currHighlightIndex + 1}/{totalSearchHits}
                                    </Typography>
                                    <Divider orientation='vertical' flexItem variant='middle' sx={{ ml: 2 }} />
                                    <ButtonGroup>
                                        <InputAdornment position='end'>
                                            <IconButton edge='end' onClick={decrementCurrIndex}>
                                                <ArrowLeftRounded />
                                            </IconButton>
                                        </InputAdornment>
                                        <InputAdornment position='end'>
                                            <IconButton edge='start' onClick={incrementCurrIndex}>
                                                <ArrowRightRounded />
                                            </IconButton>
                                        </InputAdornment>
                                        <InputAdornment position='end'>
                                            <IconButton
                                                onClick={() => {
                                                    if (searchTerm.length <= 0) setSearchFieldVisible(false)
                                                    setSearchTerm('')
                                                }}
                                                edge='start'
                                            >
                                                <ClearRounded fontSize='small' />
                                            </IconButton>
                                        </InputAdornment>
                                    </ButtonGroup>
                                </>
                            ),
                        }}
                    />
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
