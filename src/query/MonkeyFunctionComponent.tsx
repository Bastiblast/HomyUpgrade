import { useEffect, useRef, useState } from 'react'
import useMonkeyQuery from './useMonkeyQuery'
import SkeletonCard from '@/components/skeleton-card'
import { GM_deleteValue } from 'vite-plugin-monkey/dist/client'
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export default function MonkeyFunctionComponent() {
    
    const {get,monkeyResponse,ProgressBar} = useMonkeyQuery({
      name:"jsonP",
      url:"https://jsonplaceholder.typicode.com/todos/1",
      responseType:"json",
      refresh:15000,
      latence:1000,
    })

    const {data,status,progress} = monkeyResponse

    const [alertColor,setAlertColor] = useState<string>("1")

    console.log("data",data,data && data.length)
    const newDataArray = data && !data.length ? [data] : data
    useEffect(() => {
      setAlertColor( `bg-red-${Math.floor(progress/10)}00 w-6`)

    },[progress])


    useEffect(() => {
      console.log({monkeyResponse})
    },[monkeyResponse])

    const color = () => {
      if (status === "error") return 'bg-red-500'
      if (status === "completed") return 'bg-green-500'
      if (status === 'start' || status === 'load' || status === 'success') return 'bg-blue-500'
      if (progress < 100) return 'bg-green-500'
      if (progress < 150) return 'bg-amber-600'
      else return 'bg-red-500'
    }
    
    function Alert (props) {

      console.log("Alert prop",props, "color ",alertColor)
      return <div  className={color() + ' p-2 rounded-2xl w-6'}></div>
    }


  return (
    <>
    <div id='fetchUrl' className='flex flex-row justify-between m-2'>
      <button className="px-2 border-2" onClick={() => get()}>Connect</button>
    <div className='right-0'>{monkeyResponse.status}</div>
      
      <Alert />
    </div>

<ProgressBar />

    {monkeyResponse.status === "load" && !data && <SkeletonCard/>}
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
          {newDataArray &&  <TableRow>
            {Object.keys(newDataArray[0]).map((cell,index) => <TableHead key={index}>{cell.toString()}</TableHead>)}
        </TableRow>}
      </TableHeader>
      <TableBody>
        {newDataArray && Object.values(newDataArray).map((value,index) => <TableRow key={index}>
          {Object.values(value).map((cell,index) => <TableCell key={index}>{cell.toString()}</TableCell>)}
        </TableRow>)}
      </TableBody>
    </Table>

    </>
  )
}
