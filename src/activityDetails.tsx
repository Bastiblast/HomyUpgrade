import React, { useEffect, useRef, useState } from 'react';
import { uzeStore } from './store/uzeStore';
import { GM } from '$';

export default function ActivityDetails() {
	const totalHeadCount = uzeStore((s) => s.totalHeadCount);
	const updateTotalHeadCount = uzeStore((s) => s.updateTotalHeadCount);
	const updateCapacityDetails = uzeStore((s) => s.updateCapacityDetails);

	const UPH = uzeStore((s) => s.UPH);
	const TBCPT = uzeStore((s) => s.TBCPT);
	const updateUPH = uzeStore((s) => s.updateUPH);
	const updateTBCPT = uzeStore((s) => s.updateTBCPT);

	const UPHRef = useRef<HTMLInputElement>(null);
	const timeBeforeFinishRef = useRef<HTMLInputElement>(null);
	const headcountRef = useRef<HTMLInputElement>(null);

	const [customHC, setCustomHC] = useState<null | number>(totalHeadCount);
	const [timeBeforeFinish, setTimeBeforeFinish] = useState<null | number>(
		null,
	);

	const environnement = uzeStore((s) => s.environnement);
	const pageTime = uzeStore((s) => s.pageTime);
	useEffect(() => {
		//console.log("Trying cache user preference....")
		GM.getValue('Homy_capacityDetails').then((GMValue) => {
			if (!GMValue || GMValue == undefined) {
				updateUPH(145);
				updateTBCPT(45);
			} else {
				//console.log('GM_getValue("Homy_capacityDetails")',GMValue)
				const info = GMValue ? JSON.parse(GMValue) : null;
				updateUPH(
					isNaN(info.userPreference.UPH) || !info.userPreference.UPH
						? 145
						: info.userPreference.UPH,
				);
				updateTBCPT(
					isNaN(info.userPreference.TBCPT) ||
						!info.userPreference.TBCPT
						? 45
						: info.userPreference.TBCPT,
				);
			}
		});
	}, []);

	useEffect(() => {
		if (!UPH || !TBCPT) return;

		const newDetails = {
			dataTime: environnement === 'developpement' ? pageTime : Date.now(),
			userPreference: {
				UPH: UPH,
				TBCPT: TBCPT,
			},
		};
		console.log({ newDetails });
		updateCapacityDetails(newDetails);
	}, [UPH, TBCPT]);

	useEffect(() => {
		setCustomHC(totalHeadCount);
	}, [totalHeadCount]);

	const emptyInputColor = {
		0: 'bg-red-300',
	};

	return (
		<div className="grid h-full grid-flow-row grid-cols-2 border-4 border-violet-100 bg-white px-2">
			<h2 className="col-span-2 text-xl font-bold">Activity details</h2>
			<span className="col-span-2 text-xs">
				Information pour les calcules de capacité et de priorisation des
				bacs.
			</span>
			<span className={`flex items-center justify-end pr-3`}>
				headcount
			</span>
			<input
				value={String(totalHeadCount)}
				ref={headcountRef}
				onChange={(e) => updateTotalHeadCount(Number(e.target.value))}
				type="number"
				className={
					`input input-xs m-1 my-auto border-blue-400 ` +
					emptyInputColor[totalHeadCount ?? 0]
				}
			/>

			<div className={'flex items-center justify-end pr-3'}>UPH</div>
			<input
				value={UPH}
				ref={UPHRef}
				type="number"
				onChange={(e) => updateUPH(Number(e.target.value))}
				className={
					'input input-xs m-1 my-auto border-blue-400 ' +
					emptyInputColor[UPH]
				}
			/>

			<div className="flex items-center justify-end pr-3 text-end">
				Temps avant CPT
			</div>
			<input
				value={TBCPT}
				ref={timeBeforeFinishRef}
				onChange={(e) => updateTBCPT(Number(e.target.value))}
				type="number"
				className={
					`input input-xs m-1 my-auto border-blue-400 ` +
					emptyInputColor[TBCPT]
				}
			/>
		</div>
	);
}
