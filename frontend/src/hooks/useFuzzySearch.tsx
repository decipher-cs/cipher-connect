import Fuse, { FuseResult } from 'fuse.js'
import React, { useEffect, useState } from 'react'

export function useFuzzySearch<T>(searchString: string, searchData: T[], searchKeys?: string[]) {
    const [rawResult, setRawResult] = useState<FuseResult<T>[]>([])
    const [matchedQuery, setMatchedQuery] = useState<T[]>([])
    const [fuse, setFuse] = useState<Fuse<T>>()

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
        setMatchedQuery(result.map(res => res.item))
        setRawResult(result)
    }, [fuse, searchString])

    return { matchedQuery, rawResult }
}
