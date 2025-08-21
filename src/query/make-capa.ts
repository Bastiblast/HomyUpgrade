import {GM} from '$'
import csv from 'csvtojson'


export default async function makeCapaRodeo (responseText: string) {

const [pickingArray, pickedArray] = JSON.parse(responseText)

const mappingCPTpicking = new Map()

pickingArray.forEach(shipment => {
  const cpt = shipment['Expected Ship Date']
  const quantity = Number(shipment['Quantity'])
  if (mappingCPTpicking.has(cpt)) {
    mappingCPTpicking.get(cpt).set('picking', quantity + mappingCPTpicking.get(cpt).get('picking'))
  } else {
    mappingCPTpicking.set(cpt, new Map().set('picking', quantity))
  }
})

const prioTote = new Set(pickedArray.map((row) => row['Scannable ID']))

const transitArray = get().arrayData

const inTransitTote = new Map()

transitArray &&
  transitArray.forEach((element) => {
    const tote = element['Scannable ID']
    const quantiy = Number(element['Quantity'])
    const existingQuantity = inTransitTote.get(tote) ? inTransitTote.get(tote) : 0
    inTransitTote.set(tote, existingQuantity + quantiy)
  })

prioTote.forEach((tote) => inTransitTote.get(tote) && prioTote.delete(tote))

const prioToteDetailPromise = await [...prioTote].map((tote) => {
  const urlByTote = `https://rodeo-dub.amazon.com/MRS1/SearchCSV?_enabledColumns=on&enabledColumns=ASIN_TITLES&enabledColumns=OUTER_SCANNABLE_ID&Excel=false&searchKey=${tote}&shipmentType=CUSTOMER_SHIPMENTS`
  const response = GM.xmlHttpRequest({
    method: 'GET',
    url: urlByTote,
  })
    .then((resp) => csv().fromString(resp.responseText))
    .then((shipments) => {
      return { tote: tote, shipments: shipments.length }
    })

  return response
})

const prioToteDetailFetched = await Promise.all(prioToteDetailPromise)

//console.log("getRodeoData prioToteDetailFetched",prioToteDetailFetched)
//console.log("getRodeoData inTransitTote",inTransitTote)

//get().updateIBC(<Loader>Almost done </Loader>)

const mergeToteDetail = [
  ...prioToteDetailFetched,
  ...[...inTransitTote].map((entries) => {
    return { tote: entries[0], shipments: entries[1] }
  }),
]

//console.log("getRodeoData mergeToteDetail",mergeToteDetail)

const mappingCPTpicked = new Map()

pickedArray.forEach((shipment) => {
  const cpt = shipment['Expected Ship Date']
  const tote = shipment['Scannable ID']
  // add CPT and tote for each
  //console.log("getRodeoData mappingCPTpicker find ",mergeToteDetail.find(bt => bt.tote === tote))
  if (!mappingCPTpicked.has(cpt) && mergeToteDetail.find((bt) => bt.tote === tote)) {
    mergeToteDetail.find((bt) => bt.tote === tote) &&
      mappingCPTpicked.set(cpt, new Map().set(tote, mergeToteDetail.find((bt) => bt.tote === tote).shipments))
  } else if (mergeToteDetail.find((bt) => bt.tote === tote)) {
    mappingCPTpicked.get(cpt).set(tote, mergeToteDetail.find((bt) => bt.tote === tote).shipments)
  }
})

//console.log("getRodeoData mapping picking",mappingCPTpicking)
//console.log("getRodeoData mapping picked",mappingCPTpicked)
const mergedPickingAndPickedArray = new Map()

const CPTpickingArray = [...mappingCPTpicking]
CPTpickingArray.forEach((CPT) => {
  const [cpt, listValue] = CPT
  if (mergedPickingAndPickedArray.get(cpt)) {
    mergedPickingAndPickedArray.set(cpt, new Map([...mergedPickingAndPickedArray.get(cpt), ...listValue]))
  } else {
    mergedPickingAndPickedArray.set(cpt, new Map(listValue))
  }
})

//console.log("getRodeoData merge + picking",mappingCPTpicked)

const CPTpickedArray = [...mappingCPTpicked]
CPTpickedArray.forEach((CPT) => {
  const [cpt, listValue] = CPT
  if (mergedPickingAndPickedArray.get(cpt)) {
    mergedPickingAndPickedArray.set(cpt, new Map([...mergedPickingAndPickedArray.get(cpt), ...listValue]))
  } else {
    mergedPickingAndPickedArray.set(cpt, new Map(listValue))
  }
})
//console.log("getRodeoData merge + picked",mappingCPTpicked)

//console.log("getRodeoData mergedPickingAndPickedArray ",mergedPickingAndPickedArray)

 /*set({
  dataCapa: mergedPickingAndPickedArray,
  refresherCapa: 'done',
  dataCapaAge: get().pageTime,
})*/

return
}