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
    
    const {get,monkeyResponse} = useMonkeyQuery({
      name:"jsonP",
      url:"https://jsonplaceholder.typicode.com/todos",
      responseType:"json",
      refresh:15000,
      latence:0,
    })

    const {data,status,lifeTime} = monkeyResponse

    const [alertColor,setAlertColor] = useState<string>("1")

    useEffect(() => {
      setAlertColor( `bg-red-${Math.floor(lifeTime/10)}00 w-6`)

    },[lifeTime])

    const queryName = useRef("")
    const progress = {
      wait:0,
      start:10,
      load:50,
      success:90,
      error:90,
      completed:100

    }

    useEffect(() => {
      console.log({monkeyResponse})
    },[monkeyResponse])

    function Alert (props) {
      console.log("Alert prop",props, "color ",alertColor)
      return <div  className={lifeTime < 100 ? 'bg-green-500 p-2 rounded-2xl w-6' : lifeTime < 150 ? 'bg-amber-600 p-2 rounded-2xl w-6' : 'bg-red-500 p-2 rounded-2xl w-6'}></div>
    }
  return (
    <>
    <div id='fetchUrl' className='flex flex-row justify-between'>
      <button className="px-2" onClick={() => get()}>Connect</button><Alert />
    </div>
    <div id='deleteStoredCache'>
      <button className="px-2" onClick={() => GM_deleteValue(queryName.current.value)}>delete</button>
      <input className="px-2" defaultValue={"jsonP"} ref={queryName} type="text" />
    </div>

    <div>{monkeyResponse.status}</div>
    <Progress value={progress[status] || lifeTime < 101 ? lifeTime : 0}/>
    {monkeyResponse.status === "load" && <SkeletonCard/>}
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
          {data &&  <TableRow>
            {Object.keys(data[0]).map((cell,index) => <TableHead key={index}>{cell.toString()}</TableHead>)}
        </TableRow>}
      </TableHeader>
      <TableBody>
        {data && Object.values(data).map((value,index) => <TableRow key={index}>
          {Object.values(value).map((cell,index) => <TableCell key={index}>{cell.toString()}</TableCell>)}
        </TableRow>)}
      </TableBody>
    </Table>

    </>
  )
}
