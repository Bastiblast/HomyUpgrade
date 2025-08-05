import React, { useContext } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataCenterContext } from '@/query/datacenter-contextAndProvider'

export default function TablePick() {

    const {pickQuery} = useContext(DataCenterContext)


    console.log({pickQuery})

  return (
    <Card>
      <CardHeader>
        {//pickQuery.Alert()
        }
        <CardTitle>
          Pick Summary
        </CardTitle>
        <CardDescription>
          see pick remain
        </CardDescription>
      </CardHeader>
      <CardContent>
      <div onClick={() => pickQuery.get()}>{pickQuery?.response && JSON.stringify(pickQuery.response)}</div>

      </CardContent>
    </Card>
  )
}
