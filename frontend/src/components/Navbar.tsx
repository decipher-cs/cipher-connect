import { AppBar, Button, ButtonGroup, Toolbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const Navbar = (props: { redirectionPaths: string[] }) => {
    const navigate = useNavigate()
    return (
        <AppBar
            color='default'
            variant='outlined'
            sx={{
                placeItems: 'center',
                placeContent: 'center',
                height: '5vh',
                p: 0,
                m: 0,
                top: 'calc(100% - 5vh)',
                border: '0px',
            }}
        >
            <Toolbar>
                <ButtonGroup size='small'>
                    {props.redirectionPaths.map((pathName, i) => {
                        return (
                            <Button
                                key={i}
                                color='inherit'
                                onClick={() => {
                                    navigate('/' + pathName)
                                }}
                            >
                                {pathName}
                            </Button>
                        )
                    })}
                </ButtonGroup>
            </Toolbar>
        </AppBar>
    )
}
