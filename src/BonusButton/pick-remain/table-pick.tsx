import React, { useContext } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataCenterContext } from '@/query/datacenter-contextAndProvider'

export default function TablePick() {
  const { pickQuery } = useContext(DataCenterContext)

  console.log({ pickQuery })

  return (
    <Card>
      <CardHeader className='mb-1 gap-0'>
        <CardTitle>Pick Summary</CardTitle>
      </CardHeader>
      <CardContent className='mt-1 gap-0'>
        <div onClick={() => pickQuery.get()}>{pickQuery?.response && JSON.stringify(pickQuery.response)}</div>
      </CardContent>
    </Card>
  )
}
