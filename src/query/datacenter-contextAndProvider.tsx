import React, { PropsWithChildren, useState } from 'react'
import useMonkeyQuery from './useMonkeyQuery'
import { staticPickDatas } from '../pickSumList'
import { env } from '../../env'
import getRodeoPickData from './make-pick-summary'
import { createContext } from 'react'
import makePdpDatas from './make-pdp'
import { staticPDPDatas } from '@/packSinglePDP'
import { staticRodeoDatas } from '@/shipmentItemList'
import makePickDatas from './make-rodeo-picked'
import type { GMQueryResponse } from './useMonkeyQuery'
import makeLastPlan from './make-lastPlan'
import { PDPurl, planListTemplate, planURL, urlCSVPickSummary, urlCSVrodeo } from './localData'


interface DataCenterContext  { 
  ITC: number,
  pdpQuery: { response: GMQueryResponse | null; get: () => void; Alert: () => React.JSX.Element; loading: boolean } | undefined, 
  pickQuery: { response: GMQueryResponse | null; get: () => void; Alert: () => React.JSX.Element; loading: boolean } | undefined, 
  pickedQuery: { response: GMQueryResponse | null; get: () => void; Alert: () => React.JSX.Element; loading: boolean } | undefined,
  planQuery: { response: GMQueryResponse | null; get: () => void; Alert: () => React.JSX.Element; loading: boolean } | undefined, 
  boardHeadcount: number[], 
  mapping: {
    ligne1: Map<string, string>;
    ligne2: Map<string, string>;
    ligne3: Map<string, string>;
    ligne4: Map<string, string>;
  }, 
  setMapping: React.Dispatch<React.SetStateAction<{
    ligne1: Map<string, string>;
    ligne2: Map<string, string>;
    ligne3: Map<string, string>;
    ligne4: Map<string, string>;
}>>,
  setCPTList: React.Dispatch<React.SetStateAction<string[] | null>>,
  CPTList: string[] | null,
  timeRemain: () => number | undefined,
  safeTime: number,
  setSafeTime: React.Dispatch<React.SetStateAction<number>>
}

export const DataCenterContext = createContext<DataCenterContext | null>(null)

export default function DataProvider(props: PropsWithChildren) {
  const { children } = props

  const sourcePick = env === 'developpement' ? staticPickDatas : urlCSVPickSummary
  const pickQuery: DataCenterContext['pickedQuery'] = useMonkeyQuery({ name: 'pick', urls: [sourcePick], refresh: false, mutationFn: getRodeoPickData })

  const sourcePdp = env === 'developpement' ? staticPDPDatas : PDPurl
  const pdpQuery = useMonkeyQuery({
    name: 'pdp',
    urls: [JSON.stringify(sourcePdp)],
    refresh: false,
    mutationFn: makePdpDatas,
  })

  const sourcePicked = env === 'developpement' ? staticRodeoDatas : urlCSVrodeo
  const pickedQuery = useMonkeyQuery({
    name: 'picked',
    urls: [JSON.stringify(sourcePicked)],
    refresh: false,
    mutationFn: makePickDatas,
  })

  const sourcePlan = env === 'developpement' ? planListTemplate : planURL
  const planQuery = useMonkeyQuery({
    name: 'plan',
    urls: [JSON.stringify(sourcePlan)],
    refresh: false,
    mutationFn: makeLastPlan,
  })

  const [mapping, setMapping] = useState(() => {
    return {
      ligne1: new Map(),
      ligne2: new Map(),
      ligne3: new Map(),
      ligne4: new Map(),
    }
  })

	const boardHeadcount = Object.values(mapping).map((line) => line.size)

  const [CPTList,setCPTList] = useState<string[] | null>(null)

  const ITC = env === 'developpement' ? 1753109891000 : Date.now()

  const timeRemain = () => {
    const pickDatas = pickQuery?.response?.datas
    console.log({pickDatas})
    if (!pickDatas) return
    if (CPTList) {
      const nextCPT = CPTList.sort()[0]
      const timeRemain = Date.parse(nextCPT) - ITC
      return timeRemain
    } else {
      const nextCPT = pickDatas[0].data.sort()?.[0]?.[0]
      const timeRemain = Date.parse(nextCPT) - ITC
      return timeRemain
    }

  }

  const [safeTime,setSafeTime] = useState(15)
  
  console.log('data center timeRemain',timeRemain(),{CPTList})

	console.log({pdpQuery,mapping,boardHeadcount})

/*
  const [boardHeadcount, setBoardHeadcount] = useState(null)

  console.log({ pdpQuery, mapping, boardHeadcount })

  useEffect(() => {
    setBoardHeadcount(Object.values(mapping).map((line,index) => {return index = line.size}))
  }, [mapping])
*/
  return (
    <DataCenterContext.Provider
      value={{ITC, pdpQuery, pickQuery, pickedQuery, planQuery, boardHeadcount, mapping, setMapping,setCPTList,CPTList,timeRemain,safeTime,setSafeTime}}
    >
      {children}
    </DataCenterContext.Provider>
  )
}

