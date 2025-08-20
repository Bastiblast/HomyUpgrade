import React, { useContext, useEffect, useState } from 'react'
import { uzeStore } from '../store/uzeStore'
import { DataCenterContext } from '@/query/datacenter-contextAndProvider'

export default function TotalHeadCount() {
  const { boardHeadcount } = useContext(DataCenterContext)

  if (!boardHeadcount) return 0
  const totalHC = boardHeadcount.reduce((acc,val) => acc + val,0)
  console.log('render TotalHeadCount', boardHeadcount)

  return <h2 className="text-3xl">HC: {totalHC}</h2>
}
