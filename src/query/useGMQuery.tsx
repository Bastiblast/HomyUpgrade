import { ReactNode } from '@tanstack/react-router'
import { Ref, RefObject, use, useEffect, useRef, useState } from 'react'
import { GM, GM_getValue, GM_setValue, GM_xmlhttpRequest } from 'vite-plugin-monkey/dist/client'

interface MonkeyQueryProps {
  name: string;
  latence?: number;
  refresh: true | false | number
}

interface GMQueryResponse {
  status: "wait" | "start" | "load" | "abort" | "error" | 'success';
  stamp?: number;
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

export default function useMonkeyQuery({name,latence = 0,refresh = false}: MonkeyQueryProps) {

    console.log("useMonkeyQuery initialize to ")
    const getUrl = useRef<null | string>(null)
    const [monkeyResponse,setMonkeyResponse] = useState<GMQueryResponse>({status:"wait",data:null})
    const [textResponse,setTextResponse] = useState<null |string>(null)
    const [jsonResponse,setJsonResponse] = useState<null |object>(null)

    const refreshTime = typeof refresh === "number" ? refresh : 5000

    const store = ():GMQueryStorage => {
      const value = GM_getValue(name)
      return value ? JSON.parse(value) : null
    }

    console.log("Storage found ",store())

    const isOutDated = (stamp: number): boolean => {
      return (Date.now() - stamp) > refreshTime
    }

    useEffect(() => {
      const {status} = monkeyResponse
      if (status === "wait" || status === "start" || status === "load" || !refresh) return

      const timer = setInterval(() => {
        console.log("Interval set to ",refreshTime,". Data is outDated ? ",isOutDated(monkeyResponse.stamp))
        return monkeyResponse.stamp && getUrl.current && isOutDated(monkeyResponse.stamp) ? get(getUrl.current) : null
      },refreshTime)

      console.log("useEffect effect")

      return () => clearInterval(timer)
    },[monkeyResponse])
    
    async function get (url:string)  {
      getUrl.current = url
    console.log("useMonkeyQuery getting ",url)

        const httpResponse = await GM.xmlHttpRequest({
        method: "GET",
        url: url,
        headers: {
         // "Accept": "text/xml"            // If not specified, browser defaults will be used.
        },
        onloadstart: function (response) {

            setMonkeyResponse({status:"start",data: response.responseText})

        },
        onprogress: function (response) {
          setTimeout(() => 
            setMonkeyResponse({status:"load",data: response.responseText})
          ,latence
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
          setMonkeyResponse({status:"abort",stamp:Date.now(),data:"abort"})
        },        
        onerror: function (response) {
          const storeError: GMQueryStorage = {
            error:{
              stamp:Date.now(),
              response:response.responseText
            }
            }
          GM_setValue(name,JSON.stringify({...store(),...storeError}))
          setMonkeyResponse({status:"error",stamp:Date.now(),data: response.responseText})
        },
        onload: function(response) {
          switch (response.status) {
            case (200) :
              setTimeout(() => {
                console.log("success",response)
                setMonkeyResponse({status:"success",stamp:Date.now(),data: response})
                const storeSuccess: GMQueryStorage = {
                  success:{
                    stamp:Date.now(),
                    response:response.responseText
                  }
                  }
                GM_setValue(name,JSON.stringify({...store(),...storeSuccess}))
              },latence * 2)
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

                setMonkeyResponse({status:"error",data: response.status})
              },latence * 2)
          }
        }
      });
    console.log("QueryResponse ",monkeyResponse)
console.log("useMonkeyQuery ",useMonkeyQuery)
      return httpResponse
    }

    function getText (httpResponse) {
      console.log("monkeyQuery textify",httpResponse.responseText)
      setTextResponse(httpResponse.responseText)
    }

    function getJSON (httpResponse) {
     console.log("monkeyQuery jsonify")
      try {
        const json = JSON.parse(httpResponse.responseText)
        console.log("json is now ",json)
        setJsonResponse(json)
      } catch (error) {
        console.log("getJSON error",error)
        setTimeout(() => {

          setMonkeyResponse({status:"error",data:error})
        },latence * 2)
      }

    }

  return ({monkeyResponse,get,textResponse,jsonResponse,getText,getJSON})
}
