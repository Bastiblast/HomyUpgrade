import { DataCenterContext } from '@/query/datacenter-contextAndProvider'
import { uzeStore } from '@/store/uzeStore'
import React, { useContext, useRef } from 'react'
import AssociateInput from './AssociateInput'
import RenderRack from './Tote'
import searchOnRodeo from './onRodeoSearch'

export default function Poste({ poste }) {

  const UPH = uzeStore((s) => s.UPH)
  const {timeRemain,safeTime} = useContext(DataCenterContext)

  const ico = useRef(null)

  const { pickedQuery } = useContext(DataCenterContext)
  if (!pickedQuery.response?.datas) return
  const dataTotal = pickedQuery.response.datas[0].data

  console.log({safeTime},'TimeRemain ',timeRemain())

  let renderUnits,
    nextCPT,
    stationColor,
    potentiel
  if (dataTotal) {
    const railUnit = dataTotal[`dz-P-OB-Single-cvg-${poste}`]?.total
    const wsUnit = dataTotal[`ws_Singles_0${poste}`]?.total
    const stationUnits = railUnit && wsUnit ? railUnit + wsUnit : railUnit ? railUnit : wsUnit
    //console.log(poste,stationUnits,{railUnit},{wsUnit})
    const renderUnits = isNaN(stationUnits) ? null : stationUnits

    const wsCPT = dataTotal[`ws_Singles_0${poste}`]?.NextCPT
    const stationCPT = dataTotal[`dz-P-OB-Single-cvg-${poste}`]?.NextCPT
    nextCPT = wsCPT < stationCPT ? wsCPT : stationCPT

    const timeToFinish = renderUnits / UPH
    potentiel = (timeRemain() / 1000 / 60) - ((timeToFinish + safeTime) / 60)
    //console.log('nextCPT',{poste,wsCPT,stationCPT},dataTotal[`dz-P-OB-Single-cvg-${poste}`])
    //nextCPT && console.log('potentiel',timeRemain(),(timeRemain() / 1000 / 60 / 60),{poste,dataTotal,nextCPT,timeToFinish,safeTime,potentiel})
    stationColor =
      potentiel > 0 || isNaN(potentiel)
        ? 'flex flex-row shrink items-center bg-violet-400 p-1 m-1 justify-between rounded-md h-9'
        : 'flex flex-row shrink items-center bg-red-400 p-1 m-1 justify-between rounded-md h-9'
  }

  const stationSearchParams = `dz-P-OB-Single-cvg-${poste}+ws_Singles_0${poste}`

  return (
    <div className={stationColor} key={'L1' + '-' + poste}>
      <div className="flex flex-row items-center w-full">
        <div className="relative">
          <span className="bg-lime-400 p-1 mr-1 rounded-md">{String(poste)}</span>
          {renderUnits && (
            <img
              onClick={() => searchOnRodeo(stationSearchParams)}
              className="-top-1 right-0 z-10 absolute w-4 h-1/2 hover:scale-150 transition-all hover:-translate-x-1 hover:translate-y-1"
              ref={ico}
              src="https://rodeo-dub.amazon.com/resources/images/rodeo-favicon.gif"
            ></img>
          )}
        </div>
        <div className="flex flex-row">
          <AssociateInput poste={poste} />
        </div>

        <div className="flex flex-row">
          <RenderRack
            data={dataTotal}
            inductPrio={{
              prioCPT: nextCPT,
              potentiel,
            }}
            dropzone={'ws_Singles_0' + poste}
          />
          <div className="m-1 border-4"></div>
          <RenderRack
            data={dataTotal}
            inductPrio={{
              prioCPT: nextCPT,
              potentiel,
            }}
            dropzone={'dz-P-OB-Single-cvg-' + poste}
          />
        </div>
      </div>
      <div className="w-12">
        {/*fullInfo &&
												renderUnits &&
												renderUnits !== 0 &&
												renderUnits + '/u'}{' '}
											{fullInfo &&
												timeToFinish !== 0 &&
												(timeToFinish * 60).toFixed(0) +
													'/m'
													*/}
      </div>
    </div>
  )
}
