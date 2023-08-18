import { Box, Container, Link, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Balancer } from 'react-wrap-balancer'

export const About = (props: {}) => {
    const navigate = useNavigate()
    return (
        <Container>
            <Balancer>
                <Typography variant='h3'>
                    This is a demo chat app made by <Link href='https://github.com/decipher-cs/'>decipher</Link>. Design
                    was inspired by{' '}
                    <Link href='https://dribbble.com/shots/18945888-Messenger-Mobile-Web-Application-Light-Mode/attachments/14116324?mode=media'>
                        Mohammad Hashemi
                    </Link>{' '}
                    on dribble.
                </Typography>
            </Balancer>
            <Link onClick={() => navigate('/chat')}>Go Back to chat</Link>
        </Container>
    )
}
