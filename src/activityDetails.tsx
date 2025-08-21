import React, { useContext, useEffect, useRef, useState,useMemo } from 'react';
import { uzeStore } from './store/uzeStore';
import { GM } from '$';
import { DataCenterContext } from './query/datacenter-contextAndProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { useDebounce } from "use-debounce";
import { cn } from './lib/utils';


export default function ActivityDetails() {
	const context = useContext(DataCenterContext)
	if (!context) {
		throw new Error('ActivityDetails must be used within a DataCenterContext.Provider')
	}
	const {ITC,boardHeadcount,setSafeTime,productivity,setProductivity,panelHeadCount,setPanelHeadCount} = context
	const boardTotalHeadCount = boardHeadcount.reduce((acc:number,val:number) => acc + val,0)

	const [safeTimeInput,setSafeTimeInput] = useState(() => 15)

	const prevBoardValue = useRef(boardTotalHeadCount)
	const prevPanelValue = useRef(panelHeadCount)

	const totalHeadCount = useMemo(() => {
		console.log('activityDetails totalHeadCount',{boardTotalHeadCount,panelHeadCount})
		console.log('activityDetails prevBoardValue',{prevBoardValue,boardTotalHeadCount})
		console.log('activityDetails prevPanelValue',{prevPanelValue,panelHeadCount})
		let freshData
		if (panelHeadCount !== 0) freshData = panelHeadCount
		if (boardTotalHeadCount !== 0) freshData = boardTotalHeadCount
		if (prevBoardValue.current !== boardTotalHeadCount) freshData = boardTotalHeadCount
		if (prevPanelValue.current !== panelHeadCount) freshData = panelHeadCount
		prevBoardValue.current = boardTotalHeadCount
		prevPanelValue.current = panelHeadCount
		console.log('activityDetails freshData',{freshData})
		setPanelHeadCount(freshData)
	return freshData
	}
	,[boardHeadcount, panelHeadCount])
	

	const updateCapacityDetails = uzeStore((s) => s.updateCapacityDetails);

	useEffect(() => {
		//console.log("Trying cache user preference....")
		GM.getValue('Homy_capacityDetails').then((GMValue) => {
			if (!GMValue || GMValue == undefined) {
				setProductivity(145);
				setSafeTime(45);
			} else {
				//console.log('GM_getValue("Homy_capacityDetails")',GMValue)
				const info = GMValue ? JSON.parse(GMValue) : null;
				setProductivity(
					isNaN(info.userPreference.UPH) || !info.userPreference.UPH
						? 145
						: info.userPreference.UPH,
				);
				setSafeTimeInput(
					isNaN(info.userPreference.TBCPT) ||
						!info.userPreference.TBCPT
						? 45
						: info.userPreference.TBCPT,
				);
			}
		});
	}, []);

	useEffect(() => {
		if (!productivity || !safeTimeInput) return;
		console.log("new details writting")
		const newDetails = {
			dataTime: ITC,
			userPreference: {
				UPH: productivity,
				TBCPT: safeTimeInput,
			},
		};
		console.log({ newDetails });
		updateCapacityDetails(newDetails);
	}, [productivity, safeTimeInput]);

	
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Activity details
				</CardTitle>
			</CardHeader>
			<CardContent className='grid grid-cols-2'>
			<span className={`flex items-center justify-end pr-3 text-sm`}>
				headcount
			</span>
			<Input
				value={totalHeadCount || ''}
				name='headcount'
				onChange={(e) => setPanelHeadCount(Number(e.target.value))}
				type="number"
				className={cn(
					'h-6 my-1 border-blue-400',{'bg-red-300': totalHeadCount === 0}
					)
				}
			/>

			<div className={'flex items-center justify-end pr-3 text-sm'}>UPH</div>
			<Input
				value={productivity}
				name='UPH'
				type="number"
				onChange={(e) => setProductivity(Number(e.target.value))}
				className={cn(
					'h-6 my-1 border-blue-400',{'bg-red-300': productivity === 0}
					)}
			/>

			<label className="flex justify-end items-center pr-3 text-esm text-sm">
				Temps avant CPT
			</label>
			<Input
				value={safeTimeInput}
				name='secureTime'
				onChange={(e) => {
					setSafeTimeInput(Number(e.target.value))
					setSafeTime(Number(e.target.value))}}
				type="number"
				className={cn(
					'h-6 my-1 border-blue-400',{'bg-red-300': safeTimeInput === 0}
					)	}
			/>
			</CardContent>
		</Card>
	);
}
