  export const getFormatedName = (poste,PDPFiltereddata,mapping) => {
    if (!PDPFiltereddata) return ''
    const newValue = PDPFiltereddata.filter((row) => {
      return row[3].includes(poste)
    })[0]
    if (!newValue) return ''
    const posteName = newValue[3]
    const indexStart = newValue[3].indexOf('_0') + 2
    const laneNumber = posteName.substring(indexStart, indexStart + 1)
    const posteNumber = posteName.substring(indexStart, indexStart + 3)
    const newHC = { ...mapping }
    newHC[`ligne${laneNumber}`].set(posteNumber, `${newValue[0]} - ${newValue[5]}`)
    //setMapping(newHC);
    const firstLettreName = newValue[0].substring(0, 1)
    const lastNameIndex = newValue[0].indexOf(',')
    const lastName = newValue[0].substring(lastNameIndex)
    const newName = `${firstLettreName}${lastName}`
    const returnedValue = newValue[5].length > 0 ? `/!\\${newName}-${newValue[5]}` : `${newName}`
    return returnedValue
  }

