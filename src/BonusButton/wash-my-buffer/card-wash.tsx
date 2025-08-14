import React, { useContext, useEffect, useMemo, useState } from 'react'
import { getLastPlanSingle } from '../nail-the-plan/get-lastSinglePlan'
import { uzeStore } from '../../store/uzeStore'
import Loader from '../../store/loader-component'
import { DataCenterContext } from '@/query/datacenter-contextAndProvider'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'

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
    const data = (timeRemain() / 60 / 1000) - (safeTime / 60)
    console.log({data})
    return data
  }

  return (
    <div className="flex h-full w-full flex-col p-4">
      {panelHeadCount === 0 || typeof panelHeadCount !== 'number' ? (
        <span>Indiquer le nombre de packer pour lancer le calcule.</span>
      ) : !totalUnits() ? (
        <Loader>Getting time</Loader>
      ) : !productivity ? (
        <span>pas d'uph</span>
      ) : (
        plan && (
          <>
            <Table className='border-2 p-4 w-full'>
              <TableHeader className='bg-slate-100'>
                <TableRow>
                  <TableHead  className='font-bold'>PickTUR</TableHead>
                  <TableHead  className='font-bold'></TableHead>
                  <TableHead  className='font-bold'>Temps restants</TableHead>
                  <TableHead  className='font-bold'></TableHead>
                  <TableHead  className='font-bold'>deviated WIP</TableHead>
                  <TableHead  className='font-bold'>Total units</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>({plan.pick_tur.toFixed(0)}</TableCell>
                  <TableCell>X</TableCell>
                  <TableCell>{secureTimeToNextCPT().toFixed(1)}h)</TableCell>
                  <TableCell>{deviatedWIP() > 0 ? '+' : ''}</TableCell>
                  <TableCell>{deviatedWIP()?.toFixed(0)}</TableCell>
                  <TableCell>{totalUnits().toFixed(0)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
