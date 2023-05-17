import { AppBar, Button, ButtonGroup, Toolbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const Navbar = (props: { redirectionPaths: string[] }) => {
    const navigate = useNavigate()
    return (
        <AppBar
            position='static'
            color='default'
            variant='outlined'
            elevation={0}
            sx={{ placeItems: 'center', placeContent: 'center' }}
        >
            <Toolbar>
                <ButtonGroup>
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
