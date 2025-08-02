import React, { useContext } from 'react'
import {DataCenterContext} from '../../../query/datacenter-contextAndProvider'

export default function TablePick() {

    const {pickSummary} = useContext(DataCenterContext)

  return (
    <div onClick={() => pickSummary.getpickResponse()}>{pickSummary && JSON.stringify(pickSummary)}</div>
  )
}
