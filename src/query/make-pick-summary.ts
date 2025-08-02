import csv from 'csvtojson';


export default async function getRodeoPickData  (monkeyResponse)  {

	
		const CPTMap = new Map();

		//console.log("pickData response",response)

		const alternateConvert = await csv().fromString(monkeyResponse);

		alternateConvert.forEach((row) => {
			const unitExpectShipDate = row['ExSD'];
			const unitQuantity = Number(row['Quantity']);
			const unitPP = row['Process Path'];
			const unitWorpPool = row['Work Pool'];

			const allowedWorkPool = ['PickingNotYetPicked', 'PickingPicked'];
			if (
				isNaN(unitQuantity) ||
				unitPP !== 'PPSingleMedium' ||
				!allowedWorkPool.includes(unitWorpPool)
			)
				return;
			if (unitWorpPool === 'PickingPicked') {
				CPTMap.has(unitExpectShipDate)
					? null
					: CPTMap.set(unitExpectShipDate, 0);
			} else {
				CPTMap.has(unitExpectShipDate)
					? CPTMap.set(
							unitExpectShipDate,
							CPTMap.get(unitExpectShipDate) + unitQuantity,
						)
					: CPTMap.set(unitExpectShipDate, unitQuantity);
			}
		});

		const CPTArray = [...CPTMap].sort();
		//console.log({CPTArray})$
		const timeBeforeNextCPT =(new Date(CPTArray[0][0]) - Date.now()) / 60 / 60 / 1000;
		//console.log({timeBeforeNextCPT} )
        return CPTArray
	}