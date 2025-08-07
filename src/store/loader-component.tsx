import React, { PropsWithChildren } from 'react'

export default function Loader(props: PropsWithChildren) {
  const children = props.children
  return (
    <div className="flex h-full items-center justify-center">
      <span className="mx-10">{children}</span>
      <span className="loading-xl loading loading-spinner"></span>
    </div>
  )
}
