import { Skeleton } from '@/components/ui/skeleton'
import { ReactNode } from '@tanstack/react-router'
import { url } from 'inspector'
import React, { useState } from 'react'
import { GM, GM_getValue, GM_setValue, GM_xmlhttpRequest } from 'vite-plugin-monkey/dist/client'

interface GMQueryResponse {
  status: "wait" | "start" | "load" | "abort" | "error" | 'success',
  data: null | string | ReactNode
}

interface GMQueryStorage {
  stamp: number,
  response: string
}

export default function useGMQuery(name:string) {

    console.log("useGMQuery initialize to ")
    const [response,setResponse] = useState<GMQueryResponse>({status:"wait",data:null})

    const store = ():GMQueryStorage => {
      const value = GM_getValue(name)
      return value ? JSON.parse(value) : null
    }

    console.log("Storage found ",store())
    function get (url:string) {
    console.log("useGMQuery getting ",url)

        GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
         // "Accept": "text/xml"            // If not specified, browser defaults will be used.
        },
        onloadstart: function (response) {

            setResponse({status:"start",data: response.responseText})

        },
        onprogress: function (response) {
          setTimeout(() => 
            setResponse({status:"load",data: response.responseText})
          ,2000
          )
        },
        onabort: function () {
          setResponse({status:"abort",data:"abort"})
        },        
        onerror: function (response) {
          setResponse({status:"error",data: response.responseText})
        },
        onload: function(response) {
          switch (response.status) {
            case (200) :
              setTimeout(() => {
                console.log("success",response)
                setResponse({status:"success",data: response.responseText})
                GM_setValue(name,JSON.stringify({stamp:Date.now(),response:response.responseText}))
              },5000)
            break
            default :
              setTimeout(() => {
                console.log("error",response)
                setResponse({status:"error",data: response.status})
              },5000)
          }
        }
      });
    }

  return ({response,get})
}
