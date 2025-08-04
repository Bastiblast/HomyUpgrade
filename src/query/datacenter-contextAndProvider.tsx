import React, { PropsWithChildren, useEffect, useState } from 'react'
import useMonkeyQuery from './useMonkeyQuery';
import { staticPickDatas } from '../pickSumList';
import { env } from '../../env';
import getRodeoPickData from './make-pick-summary';
import { createContext } from 'react';
import makePdpDatas from './make-pdp';
import { staticPDPDatas } from '@/packSinglePDP';
import { staticRodeoDatas } from '@/shipmentItemList';
import makePickDatas from './make-rodeo-picked';

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
&workPool=ManifestPendingVerification&workPool=Manifested&workPool=Loaded&workPool=TransshipManifested&giftOption=ALL&shipOption=`;

const PDPurl =	'https://share.amazon.com/sites/MRS1-PDP/Documents%20partages/MRS1-PDP/repartMRS1.html';

const urlCSVrodeo = `https://rodeo-dub.amazon.com/MRS1/ItemListCSV?_enabledColumns=on&WorkPool=PickingPickedAtDestination&enabledColumns=ASIN_TITLES&enabledColumns=DEMAND_ID&enabledColumns=OUTER_SCANNABLE_ID&enabledColumns=SORT_CODE&Excel=false&Fracs=NON_FRACS&ProcessPath=PPSingleMedium&shipmentType=CUSTOMER_SHIPMENTS`;


export const DataCenterContext = createContext({});

export default function DataProvider(props: PropsWithChildren) {

  const {children} = props

    const sourcePick = env === 'developpement' ? staticPickDatas : urlCSVPickSummary
    const pickQuery = useMonkeyQuery({name: 'pickSummary',urls: [sourcePick],refresh: false,mutationFn:getRodeoPickData})
    
    const sourcePdp = env === 'developpement' ? staticPDPDatas : PDPurl
    const pdpQuery = useMonkeyQuery({name: 'pdpDatas',urls: [JSON.stringify(sourcePdp)],refresh: false,mutationFn:makePdpDatas})

    const sourcePicked = env === 'developpement' ? staticRodeoDatas : urlCSVrodeo
    const pickedQuery = useMonkeyQuery({name: 'picked',urls: [JSON.stringify(sourcePicked)],refresh: false,mutationFn:makePickDatas})
	useEffect(() => {
	//	!pickQuery.response?.stamp && !pickQuery.loading && pickQuery.get()
	//	!pdpQuery.response?.stamp && !pdpQuery.loading && pdpQuery.get()
		!pickedQuery.response?.stamp && !pickedQuery.loading && pickedQuery.get()
	},[])

  return (
    <DataCenterContext.Provider value={{pdpQuery,pickQuery,pickedQuery}}>
      {children}
    </DataCenterContext.Provider>
  )
}



