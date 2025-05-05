import React, { useRef } from 'react'
import useGMQuery from './useGMQuery'
import SkeletonCard from '@/components/skeleton-card'

export default function GMqueryTemplate() {
    
    const {get,response} = useGMQuery()
    const url = useRef("")

    if (response.status === "wait" && url.current) {
        
        get(url.current)
    
        console.log("in About response ",response)
    }

    

  return (
    <>
    <button onClick={() => get(url.current.value)}>fetch</button><input ref={url} type="text" />
    <div>{response.status}</div>
    {response.status === "load" && <SkeletonCard/>}
    <div>{response.data}</div>
    </>
  )
}
