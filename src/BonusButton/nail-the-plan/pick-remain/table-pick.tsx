import React, { useContext } from 'react'
import {DataCenterContext} from '../../../query/datacenter-contextAndProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TablePick() {

    const {pickResponse} = useContext(DataCenterContext)

    console.log({pickResponse})

  return (
    <Card>
      <CardHeader>
        {pickResponse.Alert()}
        <CardTitle>
          Pick Summary
        </CardTitle>
        <CardDescription>
          see pick remain
        </CardDescription>
      </CardHeader>
      <CardContent>
      <div onClick={() => pickResponse.get()}>{pickResponse.response && JSON.stringify(pickResponse.response)}</div>

      </CardContent>
    </Card>
  )
}
