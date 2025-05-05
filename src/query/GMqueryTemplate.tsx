import React, { useRef } from 'react'
import useGMQuery from './useGMQuery'
import SkeletonCard from '@/components/skeleton-card'

export default function GMqueryTemplate() {
    
    const {get,response} = useGMQuery("jsonP")
    const url = useRef(null)

    if (response.status === "wait" && url.current) {
        
        get(url.current)
    
        console.log("in About response ",response)
    }

    

  return (
    <>
    <button onClick={() => get(url.current.value)}>fetch</button>
    <input defaultValue={"https://jsonplaceholder.typicode.com/todos/"} ref={url} type="text" />
    <div>{response.status}</div>
    {response.status === "load" && <SkeletonCard/>}
    <div>{response.data}</div>
    </>
  )
}
