import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { axiosServerInstance } from '../App'
import { useAuth } from '../hooks/useAuth'
import { Routes } from '../types/routes'

export const Logout = () => {
    const {
        authStatus: { isLoggedIn },
        resetUserAuth,
    } = useAuth()

    useEffect(() => {
        if (isLoggedIn === true) {
            axiosServerInstance.get(Routes.get.logout)
            resetUserAuth()
        }
    }, [])

    return <Navigate to='/login' replace />
}
