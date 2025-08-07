import { DataCenterContext } from '@/query/datacenter-contextAndProvider'
import { useContext } from 'react'

export default function GetThePlan() {
  const { planQuery } = useContext(DataCenterContext)
  console.log({ planQuery })
  if (!planQuery.response.datas) return
  const responses = planQuery.response.datas
  console.log('responses in card plan ', responses)
  const [response] = responses
  console.log('response in card plan ', response)

  const [data] = response.data

  console.log('plan in card', data)

  const date = new Date(data.sent_timestamp)
  const dateHour = date.getHours()
  const localDate = date.setHours(dateHour - 2)
  const stringDate = new Date(localDate).toLocaleTimeString()

  console.log({ date }, { dateHour }, { localDate }, { stringDate })

  return (
    <div className="flex p-2 w-full h-full">
      {!data ? (
        <div>getThedata</div>
      ) : (
        <div>
          <div className="bg-base-100 card-border card">
            <div className="">
              <h2 className="card-title">{data.pack_station}</h2>
              <div className="grid grid-cols-2">
                <strong>Time</strong>
                <span className="">{stringDate}</span>
                <span className="">
                  <strong>WIP : </strong>
                  {data.actual_wip}
                </span>
                <span className="">
                  <strong>+1H WIP : </strong>
                  {(data.actual_wip + (data.pack_tur - data.pick_tur)).toFixed(0)}
                </span>
                <span>
                  <strong>HC Pack : </strong>
                  {data.planned_hc}
                </span>
                <span>
                  <strong>TUR Pack : </strong>
                  {data.pack_tur.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
