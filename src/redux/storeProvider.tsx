'use client'
import { AppStore, makeStore } from '@/redux/store'
import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { fetchSnippets } from './slice/snippetSlice'
import { fetchProblems } from './slice/problemSlice'

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore>(undefined)
    if (!storeRef.current) {

        storeRef.current = makeStore()
    }

    useEffect(() => {
        storeRef.current?.dispatch(fetchSnippets())
        storeRef.current?.dispatch(fetchProblems())
    }, [])

    return <Provider store={storeRef?.current}>{children}</Provider>
}

