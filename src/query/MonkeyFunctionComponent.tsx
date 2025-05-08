import { useEffect, useRef, useState } from 'react'
import useMonkeyQuery from './useMonkeyQuery'
import SkeletonCard from '@/components/skeleton-card'
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
    
    const {get,monkeyResponse,ProgressBar,Alert} = useMonkeyQuery({
      name:"jsonP",
      url:"https://jsonplaceholder.typicode.com/todos/1",
      responseType:"json",
      refresh:false,
      latence:1000,
    })

    const {data,status} = monkeyResponse

    console.log("data",data,data && data.length)
    const newDataArray = data && !data.length ? [data] : data


    useEffect(() => {
      console.log({monkeyResponse})
    },[monkeyResponse])

  return (
    <>
    <div id='fetchUrl' className='flex flex-row justify-between m-2'>
      <button className="px-2 border-2" onClick={() => get()}>Connect</button>
    <div className={status === "completed" ? 'animate-bounce' : ''}>{monkeyResponse.status}</div>
      
      <Alert />
    </div>
<ProgressBar className={"transition duration-1000"} />

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
