import {
    ArrowRightRounded,
    ArrowLeftRounded,
    ChevronRightRounded,
    CancelRounded,
    ClearRounded,
} from '@mui/icons-material'
import {
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
    ...props
}: {
    toggleRoomInfoSidebar: () => void
    room: RoomsState['joinedRooms'][0]
    searchContainerRef: RefObject<HTMLElement>
}) => {
    const {
        authStatus: { username, isLoggedIn },
    } = useAuth()

    const [searchFieldVisible, setSearchFieldVisible] = useState(false)

    const privateRoomCompanion =
        props.room.roomType === 'private' ? props.room.participants.find(p => p.username !== username) : null

    const displayName =
        props.room.roomType === 'private' ? privateRoomCompanion?.displayName : props.room.roomDisplayName

    const imgSrc = props.room.roomType === 'private' ? privateRoomCompanion?.avatarPath : props.room.roomAvatar

    const [searchTerm, setSearchTerm] = useState('')

    const highlightedElements = useRef<Element[]>([])

    const [totalSearchHits, setTotalSearchHits] = useState(0)

    const [currHighlightIndex, setCurrHighlightIndex] = useState(0)

    const incrementCurrIndex = () => setCurrHighlightIndex(p => (p >= totalSearchHits - 1 ? 0 : p + 1))

    const decrementCurrIndex = () => setCurrHighlightIndex(p => (p === 0 ? totalSearchHits - 1 : p - 1))

    useEffect(() => {
        if (!searchContainerRef || !searchContainerRef.current) return

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
    }, [searchTerm, searchContainerRef.current])

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
                    palette.mode === 'dark' ? 'rgba(100, 100, 100, 0.50)' : 'rgba(255, 255, 255, 0.50)',
                backdropFilter: 'blur(10px)',
                webkitBackdropFilter: 'blur(20px)',
                // boxShadow: 'rgba(100, 100, 100, 0.50)  0px 0px 5px 0px',

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
                    <StyledTextField
                        autoFocus
                        placeholder='Enter to search'
                        sx={{
                            minWidth: '200px',
                            maxWidth: '450px',
                            mr: 2,
                            backgroundColor: theme => theme.palette.background.light,
                        }}
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
                                            <IconButton onClick={() => setSearchTerm('')} edge='start'>
                                                <ClearRounded />
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
