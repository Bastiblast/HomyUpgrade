import React, { useContext } from 'react'
import {DataCenterContext} from '../../../query/datacenter-contextAndProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TablePick() {

    const {pickSummary} = useContext(DataCenterContext)

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Pick Summary
        </CardTitle>
        <CardDescription>
          see pick remain
        </CardDescription>
      </CardHeader>
      <CardContent>
      <div onClick={() => pickSummary.getpickResponse()}>{pickSummary && JSON.stringify(pickSummary)}</div>

      </CardContent>
    </Card>
  )
}
