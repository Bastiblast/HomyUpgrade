import React, { useContext, useEffect, useRef, useState,useMemo } from 'react';
import { uzeStore } from './store/uzeStore';
import { GM } from '$';
import { DataCenterContext } from './query/datacenter-contextAndProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { useDebounce } from "use-debounce";
import { cn } from './lib/utils';


export default function ActivityDetails() {
	const {ITC,boardHeadcount,setSafeTime,safeTime} = useContext(DataCenterContext)
	const boardTotalHeadCount = boardHeadcount.reduce((acc:number,val:number) => acc + val,0)

	const [safeTimeInput,setSafeTimeInput] = useState(() => 15)
	const [panelHeadCount,setPanelHeadCount] = useState(() => 0)

	const prevBoardValue = useRef(boardTotalHeadCount)
	const prevPanelValue = useRef(panelHeadCount)

	const totalHeadCount = useMemo(() => {
		let freshData
		if (boardTotalHeadCount === 0) freshData = panelHeadCount
		if (panelHeadCount === 0) freshData = boardTotalHeadCount
		if (prevBoardValue.current !== boardTotalHeadCount) freshData = boardTotalHeadCount
		if (prevPanelValue.current !== panelHeadCount) freshData = panelHeadCount
		prevBoardValue.current = boardTotalHeadCount
		prevPanelValue.current = panelHeadCount
	return freshData
	}
	,[boardHeadcount, panelHeadCount])
	

	const updateCapacityDetails = uzeStore((s) => s.updateCapacityDetails);

	const UPH = uzeStore((s) => s.UPH);
	const TBCPT = uzeStore((s) => s.TBCPT);
	const updateUPH = uzeStore((s) => s.updateUPH);
	const updateTBCPT = uzeStore((s) => s.updateTBCPT);

	useEffect(() => {
		const timeOut = setTimeout(() => setSafeTime(Number(safeTimeInput)),1000)
		return () => clearTimeout(timeOut)
	},[safeTimeInput])


	useEffect(() => {
		//console.log("Trying cache user preference....")
		GM.getValue('Homy_capacityDetails').then((GMValue) => {
			if (!GMValue || GMValue == undefined) {
				updateUPH(145);
				setSafeTime(45);
			} else {
				//console.log('GM_getValue("Homy_capacityDetails")',GMValue)
				const info = GMValue ? JSON.parse(GMValue) : null;
				updateUPH(
					isNaN(info.userPreference.UPH) || !info.userPreference.UPH
						? 145
						: info.userPreference.UPH,
				);
				setSafeTime(
					isNaN(info.userPreference.TBCPT) ||
						!info.userPreference.TBCPT
						? 45
						: info.userPreference.TBCPT,
				);
			}
		});
	}, []);

	useEffect(() => {
		if (!UPH || !safeTimeInput) return;

		const newDetails = {
			dataTime: ITC,
			userPreference: {
				UPH: UPH,
				TBCPT: safeTimeInput,
			},
		};
		console.log({ newDetails });
		updateCapacityDetails(newDetails);
	}, [UPH, safeTimeInput]);

	
	return (
		<Card>
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
				defaultValue={boardHeadcount}
				value={totalHeadCount}
				name='headcount'
				onChange={(e) => setPanelHeadCount(Number(e.target.value))}
				type="number"
				className={cn(
					'my-1 border-blue-400',{'bg-red-300': totalHeadCount === 0}
					)
				}
			/>

			<div className={'flex items-center justify-end pr-3 text-sm'}>UPH</div>
			<Input
				value={UPH}
				name='UPH'
				type="number"
				onChange={(e) => updateUPH(Number(e.target.value))}
				className={cn(
					'my-1 border-blue-400',{'bg-red-300': UPH === 0}
					)}
			/>

			<label className="flex justify-end items-center pr-3 text-esm text-sm">
				Temps avant CPT
			</label>
			<Input
				value={safeTimeInput}
				name='secureTime'
				onChange={(e) => setSafeTimeInput(Number(e.target.value))}
				type="number"
				className={cn(
					'my-1 border-blue-400',{'bg-red-300': safeTimeInput === 0}
					)	}
			/>
			</CardContent>
		</Card>
	);
}
