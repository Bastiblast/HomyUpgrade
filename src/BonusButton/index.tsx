import React, { useContext, useEffect } from 'react'
import { uzeStore } from '../store/uzeStore'
import usePick from './usePick'
import CapaTable from './CapaTable'
import { GM_deleteValue } from '$'
import GetThePlan from './nail-the-plan/card-plan'
import CardWash from './wash-my-buffer/card-wash'
import Loader from '../store/loader-component'
import useMonkeyQuery from '../query/useMonkeyQuery'
import FetchPickSummary, { DataCenterContext } from '../query/datacenter-contextAndProvider'
import TablePick from './pick-remain/table-pick'
import ShiftPaternSelector from './ShiftPaternSelector'

export default function BonusButton({ data }) {
  const { pdpQuery, planQuery, pickQuery, pickedQuery } = useContext(DataCenterContext)

  const { renderPick } = usePick()

  const updatePDPData = uzeStore((s) => s.updatePDPData)

  const dataCapaAge = uzeStore((s) => s.dataCapaAge)

  const updateCapaRefresher = uzeStore((s) => s.updateCapaRefresher)
  const updateIBC = uzeStore((s) => s.updateIBC)

  const dataPick = uzeStore((s) => s.dataPick)
  const dataCapa = uzeStore((s) => s.dataCapa)
  const refresher = uzeStore((s) => s.refresher)
  const refresherCapa = uzeStore((s) => s.refresherCapa)
  const refresherPick = uzeStore((s) => s.refresherPick)
  const bonusDisabled = false

  const fullInfo = uzeStore((s) => s.fullInfo)
  const updateFullInfo = uzeStore((s) => s.updateFullInfo)

  const environnement = uzeStore((s) => s.environnement)
  const pageTime = uzeStore((s) => s.pageTime)

  const isOutDated = (stamp, sec) => {
    if (!stamp || !sec) return
    const isOutDated = !((environnement === 'developpement' ? pageTime : Date.now() - sec) / 1000) < sec
    console.log(new Date(stamp).toLocaleTimeString('fr-FR'), ' is out dated ? ', isOutDated)
    return isOutDated
  }

  console.log({ planQuery })
  return (
    <div className="justify-evenly grid grid-cols-2 grid-rows-3 pt-3 h-full">
      <button
        onClick={() => planQuery.get() && updateIBC(<GetThePlan />)}
        className="bg-red-400 shadow-md m-1 rounded-none w-16 btn"
        disabled={bonusDisabled}
      >
        PLAN
      </button>
      <button
        onClick={() => pdpQuery.get()}
        className="bg-red-400 shadow-md m-1 rounded-none w-16 btn"
        disabled={bonusDisabled}
      >
        PDP
      </button>
      <button onClick={() => null} className="bg-red-400 shadow-md m-1 rounded-none w-16 btn" disabled={bonusDisabled}>
        PRIO
      </button>
      <button
        onClick={() => pickQuery.get() && updateIBC(<TablePick />)}
        className="bg-red-400 shadow-md m-1 rounded-none w-16 btn"
        disabled={bonusDisabled}
      >
        PICK
      </button>
      <button onClick={() => null} className="bg-red-400 shadow-md m-1 rounded-none w-16 btn" disabled={bonusDisabled}>
        WASH
      </button>
      <button
        onClick={() => pickedQuery.get()}
        className="bg-red-400 shadow-md m-1 rounded-none w-16 btn"
        disabled={bonusDisabled}
      >
        INFO
      </button>
    </div>
  )
}
