import React, { useRef } from 'react'
import { uzeStore } from '../store/uzeStore'
import ShiftPaternSelector from '../BonusButton/ShiftPaternSelector'

export default function InfoBox() {
  const infoBoxContent = uzeStore((s) => s.infoBoxContent)

  const renderInfoBox = () => {
    if (!infoBoxContent) return
    //console.log("New infoboxcontent ",infoBoxContent)
    const render = infoBoxContent === 'shift' ? <ShiftPaternSelector /> : infoBoxContent
    return render
  }

  return (
    <div className="relative flex w-2/5 flex-col bg-white shadow shadow-md">
      <span className="flex w-full justify-center bg-violet-100 font-bold">InfoBox</span>

      {renderInfoBox()}
    </div>
  )
}
