import React, { useEffect, useRef } from 'react'
import useGMQuery from './useGMQuery'
import SkeletonCard from '@/components/skeleton-card'
import { GM_deleteValue } from 'vite-plugin-monkey/dist/client'

export default function GMqueryTemplate() {
    
    const {get,monkeyResponse,textResponse,jsonResponse,getText,getJSON} = useGMQuery({name:"jsonP",type:"json",refresh:false})
    const url = useRef(null)
    const queryName = useRef(null)

    if (monkeyResponse.status === "wait" && url.current) {
        
        get(url.current)
    
        console.log("in About monkeyResponse ",monkeyResponse)
    }

    useEffect(() => {
      console.log({jsonResponse})
    },[jsonResponse])

    useEffect(() => {
      console.log({monkeyResponse})
    },[monkeyResponse])
    

  return (
    <>
    <div>
      <button className="px-2" onClick={() => get(url.current.value).then(resp => getJSON(resp))}>fetch</button>
      <input className="px-2" defaultValue={"https://jsonplaceholder.typicode.com/todos/1"} ref={url} type="text" />
    </div>
    <div>
      <button className="px-2" onClick={() => GM_deleteValue(queryName.current.value)}>delete</button>
      <input className="px-2" defaultValue={"jsonP"} ref={queryName} type="text" />
    </div>
    <div>{monkeyResponse.status}</div>
    <div>{monkeyResponse.status === "error" && monkeyResponse.data.toString()}</div>
    {monkeyResponse.status === "load" && <SkeletonCard/>}
    <div>{textResponse && textResponse}</div>
    </>
  )
}
