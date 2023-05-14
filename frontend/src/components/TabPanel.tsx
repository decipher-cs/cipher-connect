import { Button, Container } from '@mui/material'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void
}

export const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, handleSubmit, ...other } = props

    return (
        <>
            {value === index && (
                <Container
                    component='form'
                    role='tabpanel'
                    hidden={value !== index}
                    sx={{ display: 'flex', flexDirection: 'column', placeItems: 'center', gap: 2, marginTop: 4 }}
                    maxWidth='sm'
                    onSubmit={handleSubmit}
                    {...other}
                >
                    {children}

                <Button type='submit' variant='contained'>
                    submit
                </Button>
                </Container>
            )}
        </>
    )
}
