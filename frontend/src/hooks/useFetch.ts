import { useEffect, useState } from 'react'

export const useFetch = (URL: string, body: {}, method?: 'POST' | 'GET' | 'UPDATE') => {
    const [data, setData] = useState()

    const [error, setError] = useState<string | null>(null)

    const abortController = new AbortController()

    useEffect(() => {
        if (URL === undefined) return

        return () => {
            abortController.abort()
        }
    }, [])

    const startFetching = async () => {
        try {
            const response = await fetch('', {
                method: method ?? 'GET',
                body: JSON.stringify(body),
                signal: abortController.signal,
            })
            if (response.ok === false) {
                setError(response.statusText)
            }
            const data = await response.json()
            setData(data)
            return data
        } catch (error) {
            setError('Connection Timed out')
        }
    }

    return { data, error, startFetching }
}
