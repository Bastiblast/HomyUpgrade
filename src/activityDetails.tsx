import React, { useContext, useEffect, useRef, useState } from 'react';
import { uzeStore } from './store/uzeStore';
import { GM } from '$';
import { DataCenterContext } from './query/datacenter-contextAndProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';

export default function ActivityDetails() {
	const {boardHeadcount} = useContext(DataCenterContext)
	const totalHeadCount = boardHeadcount ? boardHeadcount.reduce((acc,val) => acc + val,0) : 0
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

	const form = useRef(null)
	const formdata = new FormData()
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
		<Card>
		<form
		ref={form}>
			<CardHeader>
				<CardTitle>

					Activity details
				</CardTitle>
				<CardDescription>
						Information pour les calcules de capacité et de priorisation des
						bacs.
				</CardDescription>
			</CardHeader>
			<CardContent className='grid grid-cols-2 mt-2'>
			<span className={`flex items-center justify-end pr-3 text-sm`}>
				headcount
			</span>
			<Input
				value={String(totalHeadCount)}
				ref={headcountRef}
				name='headcount'
				onChange={(e) => updateTotalHeadCount(Number(e.target.value))}
				type="number"
				className={
					`my-1 border-blue-400 ` +
					emptyInputColor[totalHeadCount ?? 0]
				}
			/>

			<div className={'flex items-center justify-end pr-3 text-sm'}>UPH</div>
			<Input
				value={UPH}
				ref={UPHRef}
				name='UPH'
				type="number"
				onChange={(e) => updateUPH(Number(e.target.value))}
				className={
					'my-1 border-blue-400 ' +
					emptyInputColor[UPH]
				}
			/>

			<label className="flex justify-end items-center pr-3 text-esm text-sm">
				Temps avant CPT
			</label>
			<Input
				value={TBCPT}
				ref={timeBeforeFinishRef}
				name='secureTime'
				onChange={(e) => updateTBCPT(Number(e.target.value))}
				type="number"
				className={
					`my-1 border-blue-400 ` +
					emptyInputColor[TBCPT]
				}
			/>
			</CardContent>
		</form>
		</Card>
	);
}
