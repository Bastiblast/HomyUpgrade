import PackLine from './PackLine/index'
import MultiSelectorBtn from './Header/MultiSelectorBtn'
import { uzeStore } from './store/uzeStore'
import InfoBox from './PackLine/InfoBox'
import BonusButton from './BonusButton/index'
import React, { useContext, useEffect, useState } from 'react'
import { GM_getValue, GM_setValue } from '$'
import { singlePlanTemplate, getLastPlanSingle } from './BonusButton/nail-the-plan/get-lastSinglePlan'
import ActivityDetails from './activityDetails'
import DataCenterContext from './query/datacenter-contextAndProvider'
import { Button } from './components/ui/button'
import TotalHeadCount from './Header/TotalHeadCount'
import Clock from './Header/clockHorloge'

function App() {
  const refresher = uzeStore((s) => s.refresher)
  const updateCapacityDetails = uzeStore((s) => s.updateCapacityDetails)
  const updatePickRefresher = uzeStore((s) => s.updatePickRefresher)

  const pageTime = uzeStore((s) => s.pageTime)

  useEffect(() => {
    //console.log({pageTime})
    if (pageTime) return
    const storedValue = GM_getValue('Homy_capacityDetails')
    const initValue = storedValue
      ? JSON.parse(storedValue)
      : {
          dataTime: 0,
          userPreference: {
            UPH: 145,
            TBCPT: 45,
          },
        }
    updateCapacityDetails(initValue)
    updatePickRefresher('loading')
  })

  return (
    <DataCenterContext>
      <div className="bg-gradient-to-b from-white to-violet-300 p-4 h-full App">
        <header className="flex justify-between p-1 shrink grow">
          <div className="flex flex-col justify-between">
            <h1 className="py-3 font-bold text-5xl">Homy</h1>
            <TotalHeadCount />
            <div className="flex flex-row">
              <MultiSelectorBtn />

            </div>
              {!refresher === 'loading' ? (
                <Button className="mx-2 w-20 text-white btn" disabled>
                  <span className="loading-xl loading loading-spinner"></span>
                </Button>
              ) : (
                <Button className="mx-2 w-20 btn">Refresh</Button>
              )}
          </div>
              <Clock />
          <div>
            <BonusButton />
          </div>
          <div className='w-1/5'>
            <ActivityDetails />
          </div>
          <InfoBox />
        </header>

        <PackLine />
      </div>
    </DataCenterContext>
  )
}

export default App
