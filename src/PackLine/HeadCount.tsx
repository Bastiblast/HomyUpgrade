import { useContext} from 'react'
import { DataCenterContext } from '@/query/datacenter-contextAndProvider'

export default function HeadCount({ ligne }) {
  const {boardHeadcount} = useContext(DataCenterContext)

  if (!boardHeadcount) return 0
  const lineNumber = parseInt(ligne.slice(-1)) - 1
  const HCnumber = boardHeadcount[lineNumber]
  console.log({boardHeadcount,HCnumber},parseInt(ligne.slice(-1)) - 1)

  return <>{HCnumber !== 0 ? <div className="font-bold">HC : {HCnumber} </div> : null}</>
}
