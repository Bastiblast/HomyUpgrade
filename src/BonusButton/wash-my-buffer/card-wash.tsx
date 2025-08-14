import React, { useContext, useEffect, useMemo, useState } from 'react'
import { getLastPlanSingle } from '../nail-the-plan/get-lastSinglePlan'
import { uzeStore } from '../../store/uzeStore'
import Loader from '../../store/loader-component'
import { DataCenterContext } from '@/query/datacenter-contextAndProvider'

export default function CardWash() {

  const {planQuery,panelHeadCount,ITC,safeTime,timeRemain,productivity} = useContext(DataCenterContext)

  console.log({panelHeadCount})

  
  console.log({planQuery})
  const plan = useMemo(() => planQuery.response?.datas && planQuery.response.datas[0].data[0],[planQuery])
 console.log({plan})

  const totalUnits = () => {
    if (!plan || !secureTimeToNextCPT()) return null
    const wip = deviatedWIP()
    console.log({wip})
    if (!wip) return null
    console.log("total unit",plan.pick_tur * secureTimeToNextCPT() + wip)
    return plan.pick_tur * secureTimeToNextCPT() + wip
  }

  const deviatedWIP = () => {
    if (!plan || !panelHeadCount) return
    //console.log("calcule deviatedWIP",plan.actual_wip,plan.actual_wip -(panelHeadCount * 90))
    return plan.actual_wip - (panelHeadCount * 90 + plan.pick_tur / 6)
  }

  const secureTimeToNextCPT = () => {
    console.log({safeTime},timeRemain())
    const data = timeRemain() - safeTime / 60
    console.log({data})
    return data
  }

  return (
    <div className="flex h-full flex-col items-center justify-center align-middle">
      {panelHeadCount === 0 || typeof panelHeadCount !== 'number' ? (
        <span>Indiquer le nombre de packer pour lancer le calcule.</span>
      ) : !totalUnits() ? (
        <Loader>Getting time</Loader>
      ) : !productivity ? (
        <span>pas d'uph</span>
      ) : (
        plan && (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>PickTUR</th>
                  <th></th>
                  <th>Temps restants</th>
                  <th></th>
                  <th>deviated WIP</th>
                  <th>Total units</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>({plan.pick_tur.toFixed(0)}</td>
                  <td>X</td>
                  <td>{secureTimeToNextCPT().toFixed(1)}h)</td>
                  <td>{deviatedWIP() > 0 ? '+' : ''}</td>
                  <td>{deviatedWIP()?.toFixed(0)}</td>
                  <td>{totalUnits().toFixed(0)}</td>
                </tr>
              </tbody>
            </table>
            <div>
              <span>
                <strong>Units par heure : </strong>
                {totalUnits().toFixed(0)} / {secureTimeToNextCPT().toFixed(1)}h =
                {(totalUnits() / secureTimeToNextCPT()).toFixed(0)}
              </span>
            </div>
            <div>
              <span className="w-full">
                <strong>Ressources nécessaires : </strong>
                {(totalUnits() / secureTimeToNextCPT()).toFixed(0)}u / {productivity.toFixed(0)}uph ={' '}
                {(totalUnits() / secureTimeToNextCPT() / productivity).toFixed(0)} packers
              </span>
            </div>
          </>
        )
      )}
    </div>
  )
}
