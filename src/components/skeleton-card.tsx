import React from 'react'
import { Skeleton } from './ui/skeleton'

export default function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
    <Skeleton className="rounded-xl w-full h-full" />
    <div className="space-y-2">
      <Skeleton className="w-[250px] h-4" />
      <Skeleton className="w-[200px] h-4" />
    </div>
  </div>
  )
}
