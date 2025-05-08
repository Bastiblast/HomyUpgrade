import { Progress } from '@/components/ui/progress';
import ProgressAnimationDemo from '@/components/ui/progressAnime';
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

interface progress {
  prev: number;
  next:number
}
interface GMQueryResponse {
  status: "wait" | "start" | "load" | "abort" | "error" | 'success' | 'completed' | "standby";
  errorMessage: string;
  stamp?: number;
  progress?: progress;
  lifeTime:number;
  data: null | string | ReactNode
}


export default function useMonkeyQuery({name,url,latence = 0,refresh = false,responseType}: MonkeyQueryProps) {


    const [monkeyResponse,setMonkeyResponse] = useState<GMQueryResponse>({status:"wait",data:null})
    const {status} = monkeyResponse

    const refreshTime = typeof refresh === "number" ? refresh : 5000


    const isOutDated = (stamp: number): boolean => {
      return (Date.now() - stamp) > refreshTime
    }

    const progressPercent = (): number => {
      const progress = Math.round((Date.now() - monkeyResponse.stamp) / ((refreshTime)) * 100)
      return progress ? progress : 0
    }


    useEffect(() => {
      if (status === "wait" || status === "start" || status === "load" ||status === "success" || !refresh) return

      const timer = setInterval(() => {
       if (isOutDated(monkeyResponse.stamp ? monkeyResponse.stamp : 0)) get()
          else setMonkeyResponse({...monkeyResponse,status:"standby",progress:{prev:monkeyResponse.progress.next,next: progressPercent()}})
      },3000)

      return () => clearInterval(timer)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[monkeyResponse])
    
    const color = (): string => {
      if (status === "error") return 'bg-red-500'
      if (status === "completed") return 'bg-green-500'
      if (status === 'start' || status === 'load' || status === 'success') return 'bg-blue-500 animate-pulse'
      if (progressPercent() < 100) return 'bg-green-500'
      if (progressPercent() < 150) return 'bg-amber-600'
      else return 'bg-red-500'
    }

    const duration = () => {
      return `transition duration-1000`
    }

    function ProgressBar () {
      return <ProgressAnimationDemo color={color()} duration={duration()} className='h-4' value={monkeyResponse.progress}/>
    }

    function Alert () {
      return <div className={color() + ' p-2 rounded-full w-6 h-6'}></div>
    }

    function dataMaker (resp: GmResponseEvent<"text", unknown>) {
      switch (responseType) {
        case "json": 
        console.log("monkeyQuery jsonify",status)
        try {
          setTimeout(() => {
            const json = JSON.parse(resp.responseText)
            setMonkeyResponse({...monkeyResponse,
              status:"completed",
              stamp:Date.now(),
              data:json,
              progress:{
                prev:75,
                next: 100}})
              },
              latence * 3)
        } catch (error) {
          console.log("making json error",error)
          setTimeout(() => {
            setMonkeyResponse({...monkeyResponse,status:"error", errorMessage:error.toString(), progress:{prev:monkeyResponse.progress.next,next: 100}})
          },latence * 3)
        }
        break
        case "text":
          setMonkeyResponse({...monkeyResponse,status:"completed",stamp:Date.now(),data:resp.responseText,progress:{prev:monkeyResponse.progress.next,next: 100}})
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
            setMonkeyResponse({...monkeyResponse,status:"start",progress:{prev:0,next: 15}})
        },
        onprogress: function () {
          setTimeout(() => {
          console.log("load return",{...monkeyResponse,status:"load"})
            setMonkeyResponse({...monkeyResponse,status:"load",progress:{prev:15,next: 50}})
         } ,latence 
          )
        },
        onabort: function () {
          setMonkeyResponse({...monkeyResponse,status:"abort",stamp:Date.now(),progress:{prev:75,next: 100}})
        },        
        onerror: function (response) {
          console.log("query error")
          setMonkeyResponse({...monkeyResponse,status:"error", errorMessage:response.responseText, progress:{prev:75,next: 100}})
        },
        onload: function(response) {
          switch (response.status) {
            case (200) :
              setTimeout(() => {
                setMonkeyResponse({...monkeyResponse,status:"success",stamp:Date.now(), progress:{prev:50,next: 75}})
                console.log("onload monkeyResponse ",monkeyResponse)
                dataMaker(response)
              },latence * 2)
            break
            default :
            console.log({response})
              setTimeout(() => {
                setMonkeyResponse({...monkeyResponse ,status:"error", errorMessage:response.responseText, progress:{prev:75,next: 100}})
              },latence * 2)
            break
          }
        }
      })
      
    }

  return ({monkeyResponse,get,ProgressBar,Alert})
}
