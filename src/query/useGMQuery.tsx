import { ReactNode } from '@tanstack/react-router'
import { useState } from 'react'
import { GM_getValue, GM_setValue, GM_xmlhttpRequest } from 'vite-plugin-monkey/dist/client'

interface GMQueryResponse {
  status: "wait" | "start" | "load" | "abort" | "error" | 'success',
  type: "query" | "text" | "json",
  data: null | string | ReactNode
}

interface GMQueryStorage {
  success?: { 
    stamp: number,
    response: string 
  },
  error?: {
    stamp: number,
    response: string
  },
  abort?: {
    stamp: number,
    response: string
  },
}

export default function useGMQuery(name:string) {

    console.log("useGMQuery initialize to ")
    const [response,setResponse] = useState<GMQueryResponse>({status:"wait",data:null})

    const store = ():GMQueryStorage => {
      const value = GM_getValue(name)
      return value ? JSON.parse(value) : null
    }

    console.log("Storage found ",store())

    
    function get (url:string)  {
    console.log("useGMQuery getting ",url)

        GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
         // "Accept": "text/xml"            // If not specified, browser defaults will be used.
        },
        onloadstart: function (response) {

            setResponse({status:"start",type: "query",data: response.responseText})

        },
        onprogress: function (response) {
          setTimeout(() => 
            setResponse({status:"load",type: "query",data: response.responseText})
          ,2000
          )
        },
        onabort: function () {
          const storeAbort: GMQueryStorage = {
            error:{
              stamp:Date.now(),
              response:"abort"
            }
            }
          GM_setValue(name,JSON.stringify({...store(),...storeAbort}))
          setResponse({status:"abort",type: "query",data:"abort"})
        },        
        onerror: function (response) {
          const storeError: GMQueryStorage = {
            error:{
              stamp:Date.now(),
              response:response.responseText
            }
            }
          GM_setValue(name,JSON.stringify({...store(),...storeError}))
          setResponse({status:"error",type: "query",data: response.responseText})
        },
        onload: function(response) {
          switch (response.status) {
            case (200) :
              setTimeout(() => {
                console.log("success",response)
                setResponse({status:"success",type: "query",data: response})
                const storeSuccess: GMQueryStorage = {
                  success:{
                    stamp:Date.now(),
                    response:response.responseText
                  }
                  }
                GM_setValue(name,JSON.stringify({...store(),...storeSuccess}))
              },5000)
            break
            default :
              setTimeout(() => {
                console.log("error",response)
                const storeError: GMQueryStorage = {
                  error:{
                    stamp:Date.now(),
                    response:response.responseText
                  }
                  }
                GM_setValue(name,JSON.stringify({...store(),...storeError}))

                setResponse({status:"error",type: "query",data: response.status})
              },5000)
          }
        }
      });
    console.log("QueryResponse ",response)
console.log("useGMQuery ",useGMQuery)
      return useGMQuery
    }

    function text () {
      setResponse({...response,type: "text",data: response.responseText})
    console.log("QueryResponse ",response)

    }

  return ({response,get})
}
