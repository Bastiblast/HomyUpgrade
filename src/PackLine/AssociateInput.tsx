import React, { useContext, useMemo } from 'react';
import { uzeStore } from '../store/uzeStore';
import { DataCenterContext } from '@/query/datacenter-contextAndProvider';

export default function AssociateInput({ poste }) {
	const headcount = uzeStore((s) => s.headcount);
	const updateHeadcount = uzeStore((s) => s.updateHeadcount);

	

	const {pdpQuery} = useContext(DataCenterContext)
	if (!pdpQuery.response.datas) return
	const PDPFiltereddata = pdpQuery.response.datas[0].data
	
	console.log({PDPFiltereddata})

	const handleHC = (event) => {
		const poste = event.target.name;
		const ligne = 'ligne' + event.target.name.substring(0, 1);
		const newHC = { ...headcount };
		event.target.value
			? newHC[ligne].set(poste, event.target.value)
			: newHC[ligne].delete(poste);
		//updateHeadcount(newHC);
	};

	const getValue = () => {
		if (!PDPFiltereddata) return '';
		const newValue = PDPFiltereddata.filter((row) => {
			return row[3].includes(poste);
		})[0];
		if (!newValue) return '';
		const posteName = newValue[3];
		const indexStart = newValue[3].indexOf('_0') + 2;
		const laneNumber = posteName.substring(indexStart, indexStart + 1);
		const posteNumber = posteName.substring(indexStart, indexStart + 3);
		const newHC = { ...headcount };
		newHC[`ligne${laneNumber}`].set(
			posteNumber,
			`${newValue[0]} - ${newValue[5]}`,
		);
		//updateHeadcount(newHC);
		const firstLettreName = newValue[0].substring(0, 1);
		const lastNameIndex = newValue[0].indexOf(',');
		const lastName = newValue[0].substring(lastNameIndex);
		const newName = `${firstLettreName}${lastName}`;
		const returnedValue =
			newValue[5].length > 0
				? `/!\\${newName}-${newValue[5]}`
				: `${newName}`;
				console.log({returnedValue})
		return returnedValue;
	};



	return (
		<input
			onKeyUp={handleHC}
			defaultValue={getValue()}
			className="bg-white p-2 w-24 h-8"
			type="text"
			name={poste}
			id=""
		/>
	);
}
