import { Box, Button, Container } from '@mui/material'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
    handleSubmit: React.FormEventHandler<HTMLFormElement>
    handleFormReset: React.MouseEventHandler<HTMLButtonElement>
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
                        <Button type='reset' variant='contained' onClick={handleFormReset}>
                            reset
                        </Button>
                        <Button type='submit' variant='contained'>
                            submit
                        </Button>
                    </Box>
                </Container>
            )}
        </>
    )
}
