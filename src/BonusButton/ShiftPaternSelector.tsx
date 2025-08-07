import React, { useContext, useEffect, useRef, useState } from 'react'
import { uzeStore } from '../store/uzeStore'
import { DataCenterContext } from '@/query/datacenter-contextAndProvider'

export default function ShiftPaternSelector() {
  const { pdpQuery } = useContext(DataCenterContext)
  const selector = useRef(null)
  console.log({ pdpQuery })
  if (!pdpQuery.response.datas) return
  const PDPData = pdpQuery.response.datas[0].data[0]
  console.log({ PDPData })
  const updatePDPFilteredData = uzeStore((s) => s.updatePDPFilteredData)
  const updateIBC = uzeStore((s) => s.updateIBC)

  const renderOptions = () => {
    if (!PDPData) return
    const newOptions = new Set()
    PDPData.forEach((row) => newOptions.add(row[7]))
    const newArray = [...newOptions]
    const filteredData = PDPData.filter((row) => row[7] === newArray[0])

    if (newArray.length === 1) {
      updatePDPFilteredData(filteredData)
      updateIBC(`Fin de l'importation de la PDP. ${newArray[0]}`)
    }
    return newArray.map((option) => <option key={option}>{option}</option>)
  }

  const filterWithShift = (PDPData, shift) => {
    return PDPData.filter((row) => row[7] === shift)
  }

  const handleSumitPDP = () => {
    const filteredData = PDPData.filter((row) => row[7] === selector.current.value)
    updatePDPFilteredData(filteredData)
    updateIBC(`Fin de l'importation de la PDP. ${selector.current.value}`)
  }

  return (
    <div className="flex justify-between m-2 mt-6 align-middle">
      <span className="my-auto font-bold text-md">Selectionner votre Shift :</span>
      <select ref={selector} className="mx-3 text-md select">
        {renderOptions()}
      </select>
      <button onClick={handleSumitPDP} className="my-auto btn btn-primary btn-md">
        Importer la PDP
      </button>
    </div>
  )
}
