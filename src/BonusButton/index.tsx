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
import { Button } from '@/components/ui/button'

export default function BonusButton() {
  const { capaQuery, pdpQuery, planQuery, pickQuery, pickedQuery } = useContext(DataCenterContext)


  const updateIBC = uzeStore((s) => s.updateIBC)

  const bonusDisabled = false

  console.log({ planQuery })

  const styleBtn = 'bg-slate-500/70 shadow-md m-1 rounded-none w-16  h-12 text-lg'

  return (
    <div className="justify-evenly grid grid-cols-2 grid-rows-3 pt-3 h-full">
      <Button
        onClick={() => planQuery.get() && updateIBC(<GetThePlan />)}
        className={styleBtn}
        disabled={bonusDisabled}
      >
        PLAN
      </Button>
      <Button
        onClick={() => pdpQuery.get()}
        className={styleBtn}
        disabled={bonusDisabled}
      >
        PDP
      </Button>
      <Button onClick={() => capaQuery.get()} className={styleBtn} disabled={bonusDisabled}>
        PRIO
      </Button>
      <Button
        onClick={() => pickQuery.get() && updateIBC(<TablePick />)}
        className={styleBtn}
        disabled={bonusDisabled}
      >
        PICK
      </Button>
      <Button onClick={() => planQuery.get() && updateIBC(<CardWash/>)} className={styleBtn} disabled={bonusDisabled}>
        WASH
      </Button>
      <Button
        onClick={() => pickedQuery.get()}
        className={styleBtn}
        disabled={bonusDisabled}
      >
        INFO
      </Button>
    </div>
  )
}
