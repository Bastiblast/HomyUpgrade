import { ReactNode } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { GM, GM_getValue, GM_setValue, GmResponseEvent } from 'vite-plugin-monkey/dist/client'

interface MonkeyQueryProps {
  name: string;
  url:string;
  responseType: "json" | "text" | "xml";
  latence?: number;
  refresh?: true | false | number
}

interface GMQueryResponse {
  status: "wait" | "start" | "load" | "abort" | "error" | 'success' | 'completed' | "standby" | string;
  stamp?: number;
  lifeTime?: number;
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
  }
}

export default function useMonkeyQuery({name,url,latence = 0,refresh = false,responseType}: MonkeyQueryProps) {


    const [monkeyResponse,setMonkeyResponse] = useState<GMQueryResponse>({status:"wait",data:null})
    const {status} = monkeyResponse

    const refreshTime = typeof refresh === "number" ? refresh : 5000


    const isOutDated = (stamp: number): boolean => {
      return (Date.now() - stamp) > refreshTime
    }

    const lifeTimePercent = (): number => {
      const progress = Math.round((Date.now() - monkeyResponse.stamp) / ((refreshTime)) * 100)
      return progress ? progress : 0
    }

    useEffect(() => {
      console.log("Monkey query got effect.")
      console.log("lifeTimePercent()",lifeTimePercent())
      if (status === "wait" || status === "start" || status === "load" ||status === "success" || !refresh) return

      const timer = setInterval(() => {
        console.log(name," Query is out dated ? ",isOutDated(monkeyResponse.stamp))
        if (monkeyResponse.stamp 
          && isOutDated(monkeyResponse.stamp)) get()
          else setMonkeyResponse({...monkeyResponse,status:"standby",lifeTime:lifeTimePercent()})
      },3000)

      return () => clearInterval(timer)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[monkeyResponse])
    
    function dataMaker (resp: GmResponseEvent<"text", unknown>) {
      switch (responseType) {
        case "json": 
        console.log("monkeyQuery jsonify",status)
        try {
          setTimeout(() => {
            const json = JSON.parse(resp.responseText)
            setMonkeyResponse({status:"completed",stamp:Date.now(),data:json,lifeTime:0})
          }, latence * 2);
        } catch (error) {
          setTimeout(() => {
            setMonkeyResponse({...monkeyResponse,status:"error" + error,stamp:Date.now(), lifeTime: lifeTimePercent()})
          },latence * 2)
        }
        break
        case "text":
          setMonkeyResponse({status:"completed",stamp:Date.now(),data:resp.responseText})
        break
        case "xml":
        break
      }
    }


    function get ()  {
      
        GM.xmlHttpRequest({
        method: "GET",
        url: url,
        headers: {
         // "Accept": "text/xml"            // If not specified, browser defaults will be used.
        },
        onloadstart: function () {
          console.log("start return",{...monkeyResponse,status:"start"})
            setMonkeyResponse({...monkeyResponse,status:"start"})
        },
        onprogress: function () {
          setTimeout(() => 
            setMonkeyResponse({...monkeyResponse,status:"load"})
          ,latence
          )
        },
        onabort: function () {
          setMonkeyResponse({...monkeyResponse,status:"abort",stamp:Date.now()})
        },        
        onerror: function (response) {
          console.log("query error")
          setMonkeyResponse({status:"error",stamp:Date.now(),data: response.responseText, lifeTime: lifeTimePercent()})
        },
        onload: function(response) {
          switch (response.status) {
            case (200) :
              setTimeout(() => {
                setMonkeyResponse({...monkeyResponse,status:"success",stamp:Date.now(), lifeTime: lifeTimePercent()})
                console.log("onload monkeyResponse ",monkeyResponse)
                dataMaker(response)
                console.log("New Monkey store ",JSON.parse(GM_getValue(name)))
              },latence * 2)
            break
            default :
            console.log({response})
              setTimeout(() => {
                setMonkeyResponse({...monkeyResponse ,status:"error"+response.status, lifeTime: lifeTimePercent()})
              },latence * 2)
          }
        }
      })
      
    }

  return ({monkeyResponse,get})
}
