import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express'
import pkg from 'express-openid-connect'

const { auth, requiresAuth } = pkg

dotenv.config()

const PORT = process.env.PORT || 3000

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'zCdZzfJFtKJ1dgM4DfUcJ51OcjlxqgTk',
    issuerBaseURL: 'https://dev-uronr1qqy3iuo8ek.us.auth0.com',
}

const app = express()

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config))

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
})

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user))
})

app.get('/', (req, res) => res.json({ msg: 'hello world' }))

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
