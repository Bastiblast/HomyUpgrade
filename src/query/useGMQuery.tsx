import { Skeleton } from '@/components/ui/skeleton'
import { ReactNode } from '@tanstack/react-router'
import { url } from 'inspector'
import React, { useState } from 'react'
import { GM, GM_xmlhttpRequest } from 'vite-plugin-monkey/dist/client'

interface GMQueryResponse {
  status: "wait" | "start" | "load" | "abort" | "error" | 'success',
  data: null | string | ReactNode
}

export default function useGMQuery() {

    console.log("useGMQuery initialize to ")
    const [response,setResponse] = useState<GMQueryResponse>({status:"wait",data:null})

    function get (url:string) {
    console.log("useGMQuery getting ",url)

        GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
         // "Accept": "text/xml"            // If not specified, browser defaults will be used.
        },
        onloadstart: function (response) {
          setTimeout(() => 
            setResponse({status:"start",data: response.responseText})
          ,1000
          )
        },
        onprogress: function (response) {
          setTimeout(() => 
            setResponse({status:"load",data: response.responseText})
          ,1000
          )
        },
        onabort: function () {
          setResponse({status:"abort",data:"abort"})
        },        
        onerror: function (response) {
          setResponse({status:"error",data: response.responseText})
        },
        onload: function(response) {
          setTimeout(() => 
            setResponse({status:"success",data: response.responseText})
          ,5000)
        }
      });
    }

  return ({response,get})
}
