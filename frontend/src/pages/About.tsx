import { GitHub, UndoRounded } from '@mui/icons-material'
import { Box, Button, ButtonGroup, Container, Link, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Balancer } from 'react-wrap-balancer'

export const About = (props: {}) => {
    const navigate = useNavigate()
    return (
        <Container
            sx={{
                background: theme => theme.design.background,
                backgroundSize: theme => (theme.palette.mode === 'dark' ? theme.design.backgroundSize : null),
                height: '100svh',
                maxWidth: '100%',
                display: 'grid',
                placeItems: 'center',
                placeContent: 'center',
                gridTemplateColumns: '100%',
                gap: 5,
            }}
        >
            <Balancer>
                <Typography variant='h6' textAlign='center'>
                    This is a demo for a multimedia messaging application made by{' '}
                    <Link href='https://github.com/decipher-cs/' target={'_blank'} rel='noreferrer'>
                        decipher.
                    </Link>{' '}
                    The design was inspired by{' '}
                    <Link
                        rel='noreferrer'
                        href='https://dribbble.com/shots/18945888-Messenger-Mobile-Web-Application-Light-Mode/attachments/14116324?mode=media'
                    >
                        Mohammad Hashemi's
                    </Link>{' '}
                    messenger application on dribble. Please check them out.
                </Typography>
            </Balancer>

            <ButtonGroup variant='outlined'>
                <Button onClick={() => navigate('/chat')} startIcon={<UndoRounded />}>
                    Go Back
                </Button>
                <Button LinkComponent={'button'} href='https://github.com/decipher-cs/' endIcon={<GitHub />}>
                    Source
                </Button>
            </ButtonGroup>
        </Container>
    )
}
