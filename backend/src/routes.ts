app.get('/', (_, res) => {
    res.send('we are done here!')
})

app.post('/login', (req, res) => {
    const user = { name: 'holler' }
    console.log('requested body', user)
    res.send('we are done here!')
})
