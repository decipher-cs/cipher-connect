import { useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { CredentialContext } from '../contexts/Credentials'

export const Logout = () => {
    const { username, isLoggedIn, logUserOut } = useContext(CredentialContext)

    const URL = import.meta.env.PROD ? import.meta.env.VITE_SERVER_PROD_URL : import.meta.env.VITE_SERVER_DEV_URL
    // logUserOut()

    useEffect(() => {
        if (isLoggedIn === true) {
            fetch(`${URL}/logout`, {
                body: JSON.stringify({ username }),
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            logUserOut()
        }
    }, [])

    return <Navigate to='/login' replace />
}
