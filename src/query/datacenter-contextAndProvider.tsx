import React, { PropsWithChildren, useEffect, useState } from 'react'
import useMonkeyQuery from './useMonkeyQuery';
import { staticPickDatas } from '../pickSumList';
import { env } from '../../env';
import getRodeoPickData from './make-pick-summary';
import { createContext } from 'react';


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

export const DataCenterContext = createContext({});

export default function DataProvider(props: PropsWithChildren) {

  const {children} = props

    const source = env === 'developpement' ? staticPickDatas : urlCSVPickSummary

    const pickResponse = useMonkeyQuery({name: 'pickSummary',urls: [source], responseType: "text",refresh: false,mutationFn:getRodeoPickData})
    const getpickResponse = pickResponse.get
    const pickSummary = {...pickResponse.response,getpickResponse}
	

	useEffect(() => {
		!pickResponse.response?.stamp && !pickResponse.loading && pickResponse.get()
	},[])

  return (
    <DataCenterContext.Provider value={{pickSummary}}>
      {children}
    </DataCenterContext.Provider>
  )
}



