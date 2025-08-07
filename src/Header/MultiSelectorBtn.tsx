import { useContext, useEffect, useState } from 'react'
import { uzeStore } from '../store/uzeStore'
import { DataCenterContext } from '@/query/datacenter-contextAndProvider'
import { Button } from '@/components/ui/button'
import {env} from '../../env'
export default function MultiSelectorBtn() {

  const CPTtemplate = []

  const {pickQuery} = useContext(DataCenterContext)

  const [dataPick,setDataPick] = useState(null)

  useEffect(() => {
    if (!pickQuery.response?.datas) return
    setDataPick(pickQuery.response.datas[0].data)
  },[pickQuery])

  const CPTarray = dataPick
    ? dataPick.map((cpt) => {
        const regexe = /\d{2}:\d{2}/.exec(cpt[0])
        return [regexe[0], cpt[0]]
      })
    : CPTtemplate

  
  const {CPTList,setCPTList} = useContext(DataCenterContext)

  console.log({CPTList})
  const handleClick = (event: MouseEvent) => {
    
    const actualList = CPTList ? CPTList : []
    let newArray
    const clickElement = event.target as HTMLButtonElement
    const clickContent: string = clickElement.dataset.time || ''
    //console.log("updateCPTTracking",clickContent)
    if (actualList.includes(clickContent)) {
      newArray = actualList.filter((val) => val !== clickContent)
    } else {
      newArray = [...actualList, clickContent]
    }

    const CPTArray = [...newArray].sort()
    //console.log({CPTArray})
    const timeBeforeNextCPT =
      env === 'developpement'
        ? Date.now() + 5000 / 60 / 60 / 1000
        : (new Date(CPTArray[0]) - Date.now()) / 60 / 60 / 1000

    setCPTList(newArray)

    //timeToNextCPT: timeBeforeNextCPT
  
  }

  return (
    <>
      {CPTarray.map((val, index) => {
        const isActive = CPTList && CPTList.includes(val[1]) ? 'bg-green-500' : null
        //console.log("cpt button",val,index,{CPTList})
        return (
          <Button key={val + index} className={'btn btn-sm m-1 ' + isActive} data-time={val[1]} onClick={handleClick}>
            {val[0]}
          </Button>
        )
      })}
    </>
  )
}
