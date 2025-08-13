import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'
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
import getLastPlan from './make-lastPlan'
import makeLastPlan from './make-lastPlan'
import { time } from 'console'
const jsonPlaceHolder = 'https://jsonplaceholder.typicode.com/todos/1'

const urlCSVPickSummary = `https://rodeo-dub.amazon.com/MRS1/CSV/ExSD?isEulerUpgraded=ALL&processPath=&fnSku=&fulfillmentServiceClass=ALL&exSDRange.quickRange=PLUS_MINUS_1_DAY
&isEulerPromiseMiss=ALL&zAxis=PROCESS_PATH&sortCode=&isEulerExSDMiss=ALL&exSDRange.dailyEnd=00%3A00&exSDRange.dailyStart=00%3A00&yAxis=WORK_POOL
&isReactiveTransfer=ALL&minPickPriority=MIN_PRIORITY&Excel=false&fracs=NON_FRACS&shipMethod=&shipmentTypes=CUSTOMER_SHIPMENTS&_workPool=on
&_workPool=on&_workPool=on&_workPool=on&workPool=PredictedCharge&workPool=PlannedShipment&workPool=ReadyToPick&workPool=ReadyToPickHardCapped
&workPool=ReadyToPickUnconstrained&workPool=PickingNotYetPicked&workPool=PickingNotYetPickedPrioritized&workPool=PickingNotYetPickedNotPrioritized
&workPool=PickingNotYetPickedHardCapped&workPool=CrossdockNotYetPicked&workPool=PickingPicked&workPool=PickingPickedInProgress&workPool=PickingPickedInTransit
&workPool=PickingPickedRouting&workPool=PickingPickedAtDestination&workPool=Inducted&workPool=RebinBuffered&workPool=Sorted&workPool=GiftWrap&workPool=Packing
&workPool=Scanned&workPool=ProblemSolving&workPool=ProcessPartial&workPool=SoftwareException&workPool=Crossdock&workPool=PreSort&workPool=TransshipSorted
&workPool=Palletized&workPool=ManifestPending
&workPool=ManifestPendingVerification&workPool=Manifested&workPool=Loaded&workPool=TransshipManifested&giftOption=ALL&shipOption=`

const PDPurl = 'https://share.amazon.com/sites/MRS1-PDP/Documents%20partages/MRS1-PDP/repartMRS1.html'

const urlCSVrodeo = `https://rodeo-dub.amazon.com/MRS1/ItemListCSV?_enabledColumns=on&WorkPool=PickingPickedAtDestination&enabledColumns=ASIN_TITLES&enabledColumns=DEMAND_ID&enabledColumns=OUTER_SCANNABLE_ID&enabledColumns=SORT_CODE&Excel=false&Fracs=NON_FRACS&ProcessPath=PPSingleMedium&shipmentType=CUSTOMER_SHIPMENTS`

type DataCenterContext = { 
  pdpQuery: GMQueryResponse, 
  pickQuery: GMQueryResponse, 
  pickedQuery: GMQueryResponse,
  planQuery: GMQueryResponse, 
  boardHeadcount: number[], 
  mapping: [string,string][], 
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
} | null

export const DataCenterContext = createContext<DataCenterContext>(null)

export default function DataProvider(props: PropsWithChildren) {
  const { children } = props

  const sourcePick = env === 'developpement' ? staticPickDatas : urlCSVPickSummary
  const pickQuery = useMonkeyQuery({ name: 'pick', urls: [sourcePick], refresh: false, mutationFn: getRodeoPickData })

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

	const boardHeadcount = Object.values(mapping).map((line,index) => {return index = line.size})

  const [CPTList,setCPTList] = useState<string[] | null>(null)

  const ITC = env === 'developpement' ? 1753109891000 : Date.now()

  const timeRemain = () => {
    const time = ITC
    if (!pickQuery.response?.datas) return
    if (CPTList) {
      const nextCPT = CPTList.sort()[0]
      const timeRemain = Date.parse(nextCPT) - time
      return timeRemain
    } else {
      const nextCPT = pickQuery.response?.datas[0].data.sort()[0][0]
      const timeRemain = Date.parse(nextCPT) - time
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

const date = new Date(Date.now())
const year = date.getFullYear()
const month = ('0' + (date.getMonth() + 1).toString()).slice(-2)
const day = ('0' + date.getDate().toString()).slice(-2)
const formatedDate = `${year}-${month}-${day}`

const planURL = `https://ecft.fulfillment.a2z.com/api/nssp/get_nssp_big_table_new?dashboard=true&fcSelected=MRS1&region=EU&startDate=${formatedDate}&startTime=00%3A00%3A01`

const planListTemplate = [
  {
    fc: 'MRS1',
    sent_timestamp: '2025-07-23T00:51:23.000Z',
    refresh_timestamp: '2025-07-23T00:49:45.000Z',
    hour: 0,
    row: '1',
    rootcause: '             ',
    category: 'Green',
    ops_feedback: 'Promoted',
    plan_type: 'PLAN 1',
    plan_promoted: '00:51',
    plan_length: 40,
  },
  {
    fc: 'MRS1',
    sent_timestamp: '2025-07-23T01:14:16.000Z',
    refresh_timestamp: '2025-07-23T01:11:08.000Z',
    hour: 1,
    row: '1',
    rootcause: '             ',
    category: 'Green',
    ops_feedback: 'Promoted',
    plan_type: 'PLAN 1',
    plan_promoted: '01:14',
    plan_length: 20,
  },
  {
    fc: 'MRS1',
    sent_timestamp: '2025-07-23T02:16:06.000Z',
    refresh_timestamp: '2025-07-23T01:55:50.000Z',
    hour: 2,
    row: '1',
    rootcause: '             ',
    category: 'Green',
    ops_feedback: 'Promoted',
    plan_type: 'PLAN 1',
    plan_promoted: '02:16',
    plan_length: 50,
  },
  {
    fc: 'MRS1',
    sent_timestamp: '2025-07-23T06:06:32.000Z',
    refresh_timestamp: '2025-07-23T05:56:44.000Z',
    hour: 6,
    row: '1',
    rootcause: '   Plan with short term risk          ',
    category: 'Red',
    ops_feedback: 'Promoted',
    plan_type: 'PLAN 1',
    plan_promoted: '06:06',
    plan_length: 185,
  },
  {
    fc: 'MRS1',
    sent_timestamp: '2025-07-23T07:30:15.000Z',
    refresh_timestamp: '2025-07-23T07:27:05.000Z',
    hour: 7,
    row: '1',
    rootcause: '   Plan with short term risk          ',
    category: 'Red',
    ops_feedback: 'Promoted',
    plan_type: 'PLAN 1',
    plan_promoted: '07:30',
    plan_length: 110,
  },
  {
    fc: 'MRS1',
    sent_timestamp: '2025-07-23T08:20:05.000Z',
    refresh_timestamp: '2025-07-23T08:17:17.000Z',
    hour: 8,
    row: '1',
    rootcause: '   Plan with short term risk          ',
    category: 'Red',
    ops_feedback: 'Promoted',
    plan_type: 'PLAN 1',
    plan_promoted: '08:20',
    plan_length: 60,
  },
  {
    fc: 'MRS1',
    sent_timestamp: '2025-07-23T09:41:17.000Z',
    refresh_timestamp: '2025-07-23T09:37:26.000Z',
    hour: 9,
    row: '1',
    rootcause: '             ',
    category: 'Green',
    ops_feedback: 'Promoted',
    plan_type: 'PLAN 1',
    plan_promoted: '09:41',
    plan_length: 215,
  },
  {
    fc: 'MRS1',
    sent_timestamp: '2025-07-23T09:59:34.000Z',
    refresh_timestamp: '2025-07-23T09:57:01.000Z',
    hour: 9,
    row: '1',
    rootcause: '             ',
    category: 'Green',
    ops_feedback: 'Promoted',
    plan_type: 'PLAN 1',
    plan_promoted: '09:59',
    plan_length: 205,
  },
  {
    fc: 'MRS1',
    sent_timestamp: '2025-07-23T10:49:07.000Z',
    refresh_timestamp: '2025-07-23T10:46:41.000Z',
    hour: 10,
    row: '1',
    rootcause: '             ',
    category: 'Green',
    ops_feedback: 'Promoted',
    plan_type: 'PLAN 1',
    plan_promoted: '10:49',
    plan_length: 155,
  },
  {
    fc: 'MRS1',
    sent_timestamp: '2025-07-23T11:35:30.000Z',
    refresh_timestamp: '2025-07-23T11:33:34.000Z',
    hour: 11,
    row: '1',
    rootcause: '             ',
    category: 'Green',
    ops_feedback: 'Promoted',
    plan_type: 'PLAN 1',
    plan_promoted: '11:35',
    plan_length: 105,
  },
  {
    fc: 'MRS1',
    sent_timestamp: '2025-07-23T12:21:52.000Z',
    refresh_timestamp: '2025-07-23T12:19:54.000Z',
    hour: 12,
    row: '1',
    rootcause: '             ',
    category: 'Green',
    ops_feedback: 'Promoted',
    plan_type: 'PLAN 1',
    plan_promoted: '12:21',
    plan_length: 60,
  },
  {
    fc: 'MRS1',
    sent_timestamp: '2025-07-23T13:23:02.000Z',
    refresh_timestamp: '2025-07-23T13:20:08.000Z',
    hour: 13,
    row: '1',
    rootcause: '             ',
    category: 'Green',
    ops_feedback: 'Promoted',
    plan_type: 'PLAN 1',
    plan_promoted: '13:23',
    plan_length: 210,
  },
]
