import React, { useContext, useMemo } from 'react';
import { uzeStore } from '../store/uzeStore';
import { DataCenterContext } from '@/query/datacenter-contextAndProvider';

export default function AssociateInput({ poste }) {
	
		const {boardHeadcount} = useContext(DataCenterContext)

	const updateHeadcount = uzeStore((s) => s.updateHeadcount);

		const {mappingState} = useContext(DataCenterContext)
		const [mapping,setMapping] = mappingState

	const {pdpQuery} = useContext(DataCenterContext)
	
	let PDPFiltereddata
	if (pdpQuery.response.datas) {
		PDPFiltereddata = pdpQuery.response.datas[0].data
	}
	console.log({PDPFiltereddata},{mappingState},{mapping},{boardHeadcount})
	

	const headcountTotal = (newHC) => {
		let totalHC = 0;
		Object.values(newHC).forEach((line) => {
			totalHC += line.size;
		});
		console.log("calcule new total",totalHC)
		return totalHC
	};

	const handleHC = (event) => {
		const poste = event.target.name;
		const ligne = 'ligne' + event.target.name.substring(0, 1);
		const newHC = { ...mapping };
		event.target.value
			? newHC[ligne].set(poste, event.target.value)
			: newHC[ligne].delete(poste);
		setMapping(newHC);
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
		const newHC = { ...mapping };
		newHC[`ligne${laneNumber}`].set(
			posteNumber,
			`${newValue[0]} - ${newValue[5]}`,
		);
		//setMapping(newHC);
		const firstLettreName = newValue[0].substring(0, 1);
		const lastNameIndex = newValue[0].indexOf(',');
		const lastName = newValue[0].substring(lastNameIndex);
		const newName = `${firstLettreName}${lastName}`;
		const returnedValue =
			newValue[5].length > 0
				? `/!\\${newName}-${newValue[5]}`
				: `${newName}`;
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
