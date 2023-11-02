import { Box, Button, CircularProgress, Container, IconButton, Typography } from '@mui/material'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
    handleSubmit: React.FormEventHandler<HTMLFormElement>
    handleFormReset: React.MouseEventHandler<HTMLButtonElement>
    isSubmitting: boolean
}

export const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, handleSubmit, handleFormReset } = props

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
                >
                    {children}

                    <Box display='inline-flex' gap={3}>
                        <Button
                            type='reset'
                            variant='contained'
                            onClick={handleFormReset}
                            disabled={props.isSubmitting}
                        >
                            reset
                        </Button>
                        <Button type='submit' variant='contained' disabled={props.isSubmitting}>
                            submit
                            {props.isSubmitting ? <CircularProgress sx={{ position: 'absolute' }} size={28} /> : null}
                        </Button>
                    </Box>
                </Container>
            )}
        </>
    )
}
