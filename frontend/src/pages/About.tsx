import { Box, Link, Typography } from '@mui/material'

export const About = (props: {}) => {
    return (
        <Box>
            <Typography>
                This is a demo chat app made by <Link href='https://github.com/decipher-cs/'>me</Link>. Design was
                inspired by
                <Link href='https://dribbble.com/shots/18945888-Messenger-Mobile-Web-Application-Light-Mode/attachments/14116324?mode=media'>
                    Mohammad Hashemi
                </Link>
                on dribble.
            </Typography>
        </Box>
    )
}
