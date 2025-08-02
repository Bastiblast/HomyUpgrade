import { useEffect, useRef } from 'react';
import { uzeStore } from '../store/uzeStore';
import { GM } from '$';
import ActivityDetails from '.././activityDetails';

export default function CapaTable(data) {
	console.log('CapaTable data', data);
	const totalHeadCount = uzeStore((s) => s.totalHeadCount);
	const pageTime = uzeStore((s) => s.pageTime);

	const UPH = uzeStore((s) => s.UPH);
	const updateUPH = uzeStore((s) => s.updateUPH);
	const TBCPT = uzeStore((s) => s.TBCPT);
	const updateTBCPT = uzeStore((s) => s.updateTBCPT);

	useEffect(() => {
		GM.getValue('Homy_capacityDetails').then((value) => {
			if (value) {
				const json = JSON.parse(value);
				console.log(
					'get gm value',
					value,
					'TBCPT',
					json.userPreference.TBCPT,
				);
				updateUPH(json.userPreference.UPH);
				updateTBCPT(json.userPreference.TBCPT);
			}
		});
	}, []);

	let totalPick = 0;

	const procced = useRef(new Map());

	const noPackerWarning = totalHeadCount === 0 && (
		<span className="col-span-full">
			Indiquer un nombre de pack pour calculer la capacité.
		</span>
	);

	const dataObject = data.data;

	//console.log("CapaTable dataObject",dataObject)

	if (!dataObject) return;

	const noDataWarning = dataObject.size === 0 && (
		<span className="col-span-full">
			Il n'y a pas de CPT dans les 4 prochaines heures.
		</span>
	);

	const mapToArray = [...dataObject.entries()].sort();

	console.log('CapaTable array ', mapToArray);

	const capaTable = (UPH, TBCPT, totalHeadCount) =>
		mapToArray.map((CPT, index) => {
			console.log('CapaTable CPT index', CPT, index, UPH, TBCPT);

			if (!UPH || !TBCPT) return;

			const [cpt, listValue] = CPT;

			procced.current =
				index !== 0
					? new Map([...listValue, ...procced.current])
					: listValue;

			const dateCPT = Date.parse(cpt);

			const dateAct = pageTime;

			const remainingTime = Math.round((dateCPT - dateAct) / 60 / 1000);

			const deadLineTime =
				remainingTime - TBCPT > 0 ? remainingTime - TBCPT : 0;

			//console.log("CapaTable debug",{dateCPT},{pageTime},{dateAct},remainingTime)

			const btNumber = listValue.size;
			const allBtNumber = procced.current.size;

			const unitNumber =
				btNumber > 1
					? [...listValue].reduce((acc, val) => {
							if (val[0] === 'picking') {
								totalPick += val[1];
								return acc + totalPick + val[1];
							}
							return acc + val[1];
						}, 0)
					: [...listValue][0][1];

			const allUnitNumber =
				allBtNumber > 1
					? [...procced.current].reduce((acc, val) => {
							if (val[0] === 'picking') {
								totalPick += val[1];
								return acc + totalPick + val[1];
							}
							return acc + val[1];
						}, 0)
					: [...procced.current][0][1];

			//console.log("CapaTable units",[...listValue],[...procced.current])

			const header = cpt.substring(11, 16);

			const packCalculation = Math.ceil(
				Number(allUnitNumber) / UPH / (deadLineTime / 60),
			);
			const packerNeeded =
				deadLineTime === 0
					? 'Finish'
					: String(packCalculation) + ' pack';
			//console.log("CapaTable headers ",header)

			const riskStyle = () => {
				const color = {
					'': '',
					danger: 'bg-red-500',
					high: 'bg-amber-500',
					medium: 'bg-amber-300',
					carefull: 'bg-amber-100',
					peace: 'bg-lime-300',
				};
				if (!totalHeadCount) return color[''];
				//console.log("CapaTable risk calculating ",customHC,packerNeeded)

				const percentRisk = totalHeadCount / packCalculation;
				//console.log("CapaTable risk calculating ",percentRisk)
				if (percentRisk < 0.5) return color['danger'];
				if (percentRisk < 0.75) return color['high'];
				if (percentRisk < 0.9) return color['medium'];
				if (percentRisk < 1.1) return color['carefull'];
				return color['peace'];
			};

			const colorRisk = riskStyle();

			return (
				<>
					<div
						key={index}
						className={
							'flex items-center justify-center border-b-2 border-r-2 ' +
							colorRisk
						}
					>
						{header}
					</div>
					<div
						key={index + 1}
						className={
							'flex items-center justify-center border-b-2 border-r-2 ' +
							colorRisk
						}
					>
						{allBtNumber}
					</div>
					<div
						key={index + 2}
						className={
							'flex items-center justify-center border-b-2 border-r-2 ' +
							colorRisk
						}
					>
						{index === 0 ? unitNumber : allUnitNumber}
					</div>
					<div
						key={index + 3}
						className={
							'flex items-center justify-center border-b-2 border-r-2 ' +
							colorRisk
						}
					>
						{deadLineTime}min
					</div>
					<div
						key={index + 4}
						className={
							'flex items-center justify-center border-b-2 ' +
							colorRisk
						}
					>
						{packerNeeded}
					</div>
				</>
			);
		});

	return (
		<div className="flex h-full w-full flex-row items-center justify-center bg-violet-100">
			<div className="grid grid-flow-row grid-cols-5 border-4 border-violet-100 bg-white p-2">
				<div className="h-8 border-b-2 border-r-2 px-4 text-center font-bold">
					CPT
				</div>

				<div className="h-8 border-b-2 border-r-2 px-4 text-center font-bold">
					{' '}
					BT Prio
				</div>

				<div className="h-8 border-b-2 border-r-2 px-4 text-center font-bold">
					Units Prio
				</div>

				<div className="h-8 border-b-2 border-r-2 px-4 text-center font-bold">
					Remain
				</div>
				<div className="h-8 border-b-2 px-4 text-center font-bold">
					Attendu
				</div>

				{dataObject.size > 0 && capaTable(UPH, TBCPT, totalHeadCount)}

				{noDataWarning || noPackerWarning}
			</div>
		</div>
	);
}
