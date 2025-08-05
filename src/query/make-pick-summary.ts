import csv from 'csvtojson';

const getRodeoPickDataReturn = [
    [
        "2025-07-21 17:00",
        5
    ],
    [
        "2025-07-21 20:00",
        1655
    ],
    [
        "2025-07-21 20:30",
        1027
    ],
    [
        "2025-07-21 23:30",
        262
    ],
    [
        "2025-07-21 23:45",
        2363
    ]
]

export default async function getRodeoPickData  (responseText: string)  {

	
		const CPTMap = new Map();

		console.log("pickData response",responseText)

		const alternateConvert = await csv().fromString(responseText);

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

		const CPTArray = [...CPTMap].sort() as typeof getRodeoPickDataReturn;
		console.log({CPTArray})
		//const timeBeforeNextCPT =(new Date(CPTArray[0][0]) - Date.now()) / 60 / 60 / 1000;
		//console.log({timeBeforeNextCPT} )

		const isValid = typeof getRodeoPickDataReturn === typeof CPTArray
		const isEmpty = CPTArray.length === 0 
		const mutated = !isValid || isEmpty ? "error on mutation, data don't look as expected or feed is empty"  : CPTArray
		console.log({mutated},isEmpty)
        return await mutated
	}