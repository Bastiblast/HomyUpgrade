import { env } from '@/../env'
import { staticRodeoDatas } from '@/shipmentItemList'
import csv from 'csvtojson'

export default function makePickDatas(responseText: string) {
  switch (env) {
    case 'production':
      console.log('active production mode')
      return csv()
        .fromString(responseText)
        .then((csvRow) => {
          return buildJSON(csvRow)
        })

      break
    case 'developpement':
      console.log('active developpement mode')

      //console.log("staticRodeoDatas",staticRodeoDatas, typeof staticRodeoDatas)
      return csv()
        .fromString(staticRodeoDatas)
        .then((csvRow) => {
          return buildJSON(csvRow)
        })
      break
  }
}

function buildJSON(csvRow) {
  // @ts-ignore TS don't recognize groupBy
  const csvGroupByDZ = Object.groupBy(csvRow, (row) => row['Outer Scannable ID'])

  Object.entries(csvGroupByDZ).forEach((entries) => {
    const [key, val] = entries
    // @ts-ignore TS don't recognize groupBy

    const subGroup = Object.groupBy(val, (row) => row['Scannable ID'])
    csvGroupByDZ[key] = subGroup
    Object.entries(csvGroupByDZ[key]).forEach((entries) => {
      const [keyz, value] = entries
      // @ts-ignore TS don't recognize groupBy

      const zubGroup = Object.groupBy(value, (row) => row['Expected Ship Date'])
      csvGroupByDZ[key][keyz] = zubGroup
    })
  })
  console.log('Json build', csvGroupByDZ)

  return csvGroupByDZ
}
