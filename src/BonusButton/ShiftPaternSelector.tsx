import React, { useEffect, useRef, useState } from 'react';
import { uzeStore } from '../store/uzeStore';

export default function ShiftPaternSelector() {
	const selector = useRef(null);

	const PDPData = uzeStore((s) => s.PDPdata);
	const updatePDPFilteredData = uzeStore((s) => s.updatePDPFilteredData);
	const updateIBC = uzeStore((s) => s.updateIBC);

	const renderOptions = () => {
		if (!PDPData) return;
		const newOptions = new Set();
		PDPData.forEach((row) => newOptions.add(row[7]));
		const newArray = [...newOptions];
		const filteredData = PDPData.filter((row) => row[7] === newArray[0]);

		if (newArray.length === 1) {
			updatePDPFilteredData(filteredData);
			updateIBC(`Fin de l'importation de la PDP. ${newArray[0]}`);
		}
		return newArray.map((option) => <option key={option}>{option}</option>);
	};

	const filterWithShift = (PDPData, shift) => {
		return PDPData.filter((row) => row[7] === shift);
	};

	const handleSumitPDP = () => {
		const filteredData = PDPData.filter(
			(row) => row[7] === selector.current.value,
		);
		updatePDPFilteredData(filteredData);
		updateIBC(`Fin de l'importation de la PDP. ${selector.current.value}`);
	};

	return (
		<div className="m-2 mt-6 flex justify-between align-middle">
			<span className="text-md my-auto font-bold">
				Selectionner votre Shift :
			</span>
			<select ref={selector} className="text-md select mx-3">
				{renderOptions()}
			</select>
			<button
				onClick={handleSumitPDP}
				className="btn btn-primary btn-md my-auto"
			>
				Importer la PDP
			</button>
		</div>
	);
}
