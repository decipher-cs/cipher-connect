import Fuse, { FuseResult } from 'fuse.js'
import React, { useEffect, useState } from 'react'
import { useToast } from './useToast'

export function useFuzzySearch<T>(searchString: string, searchData: T[], searchKeys?: string[]) {
    const [rawResult, setRawResult] = useState<FuseResult<T>[]>([])
    const [matchedQuery, setMatchedQuery] = useState<T[]>([])
    const [fuse, setFuse] = useState<Fuse<T>>()
    const { notify } = useToast()

    useEffect(() => {
        const fuse = new Fuse(searchData, { keys: searchKeys })
        setFuse(fuse)
    }, [searchData, searchKeys])

    useEffect(() => {
        if (!fuse) return
        if (!searchString || searchString.length === 0) {
            setMatchedQuery(searchData)
            return
        }

        const result = fuse.search(searchString)
        if (result.length <= 0) notify('No matches', 'warning')
        setMatchedQuery(result.map(res => res.item))
        setRawResult(result)
    }, [fuse, searchString])

    return { matchedQuery, rawResult }
}
