import { Box, Button, ButtonGroup, Container, Link, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Balancer } from 'react-wrap-balancer'

export const About = (props: {}) => {
    const navigate = useNavigate()
    return (
        <Container
            sx={{
                height: '100svh',
                maxWidth: '100vw',
                display: 'grid',
                placeItems: 'flex-start',
                placeContent: 'flex-start',
                gap: 5,
            }}
        >
            <Balancer>
                <Typography variant='h5'>
                    This is a demo for a multimedia messaging application made by
                    <Link href='https://github.com/decipher-cs/'> decipher </Link>. The design was inspired by{' '}
                    <Link href='https://dribbble.com/shots/18945888-Messenger-Mobile-Web-Application-Light-Mode/attachments/14116324?mode=media'>
                        Mohammad Hashemi's{' '}
                    </Link>
                    messagenger application on dribble. Please check them out.
                </Typography>
            </Balancer>
            <ButtonGroup variant='outlined'>
                <Button onClick={() => navigate('/chat')}>Go Back to chat</Button>
                <Button LinkComponent={'button'} href='https://github.com/decipher-cs/'>
                    Source Code
                </Button>
            </ButtonGroup>
        </Container>
    )
}
