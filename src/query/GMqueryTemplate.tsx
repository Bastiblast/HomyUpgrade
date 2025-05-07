import React, { useRef } from 'react'
import useGMQuery from './useGMQuery'
import SkeletonCard from '@/components/skeleton-card'
import { GM_deleteValue } from 'vite-plugin-monkey/dist/client'

export default function GMqueryTemplate() {
    
    const {get,response} = useGMQuery("jsonP")
    const url = useRef(null)
    const queryName = useRef(null)

    if (response.status === "wait" && url.current) {
        
        get(url.current)
    
        console.log("in About response ",response)
    }

    

  return (
    <>
    <div>
      <button className="px-2" onClick={() => get(url.current.value).text()}>fetch</button>
      <input className="px-2" defaultValue={"https://jsonplaceholder.typicode.com/todos/"} ref={url} type="text" />
    </div>
    <div>
      <button className="px-2" onClick={() => GM_deleteValue(queryName.current.value)}>delete</button>
      <input className="px-2" defaultValue={"jsonP"} ref={queryName} type="text" />
    </div>
    <div>{response.status}</div>
    {response.status === "load" && <SkeletonCard/>}
    <div>{ response.type === "text" && response.data}</div>
    </>
  )
}
