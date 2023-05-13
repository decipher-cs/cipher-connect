import { useEffect, useState } from 'react'

export const useAuth = () => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState()

    useEffect(() => {

    }, [])

    return isUserLoggedIn
}
