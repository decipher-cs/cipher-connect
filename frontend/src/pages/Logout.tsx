import { useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { axiosServerInstance } from '../App'
import { CredentialContext } from '../contexts/Credentials'

export const Logout = () => {
    const { username, isLoggedIn, logUserOut } = useContext(CredentialContext)

    const URL = import.meta.env.VITE_SERVER_URL
    // logUserOut()

    useEffect(() => {
        if (isLoggedIn === true) {
            axiosServerInstance.post('/logout', { username })
            logUserOut()
        }
    }, [])

    return <Navigate to='/login' replace />
}
