import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { axiosServerInstance } from '../App'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { Routes } from '../types/routes'

export const Logout = () => {
    const {
        authStatus: { isLoggedIn },
        resetUserAuth,
    } = useAuth()

    const { notify } = useToast()

    useEffect(() => {
        if (isLoggedIn === true) {
            axiosServerInstance.get(Routes.get.logout, { retry: 3 })
            resetUserAuth()
            notify('Logout Successful', 'success')
        }
    }, [])

    return <Navigate to='/login' replace />
}
