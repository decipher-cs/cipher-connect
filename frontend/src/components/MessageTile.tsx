import { Paper, Typography } from '@mui/material'

export const MessageTile = (props: {
    textContent: string
    alignment: 'left' | 'right'
    autoScrollToBottomRef: React.RefObject<HTMLDivElement> | null
}) => {
    return (
        <Paper
            sx={{
                borderRadius: props.alignment === 'left' ? '0px 45px 45px 45px' : '45px 0px 45px 45px',
                px: 4,
                py: 3,
                alignSelf: props.alignment === 'left' ? 'flex-start' : 'flex-end',
                width: 'fit-content',
                maxWidth: '80%',
                backgroundImage: 'linear-gradient(45deg,#3023AE 0%,#FF0099 100%)',
            }}
            ref={props.autoScrollToBottomRef}
        >
            <Typography sx={{ overflowWrap: 'break-word', color: 'white' }}>{props.textContent}</Typography>
        </Paper>
    )
}
