import { useContext } from 'react';
import { uzeStore } from '../store/uzeStore';
import RenderBuffer from './Buffer';
import HeadCount from './HeadCount';
import { DataCenterContext } from '@/query/datacenter-contextAndProvider';
import Poste from './Poste';

export default function PackLine() {

	const {pickedQuery,mapping} = useContext(DataCenterContext)

console.log({pickedQuery})

	const posteMapping = uzeStore((s) => s.singleLaneMapping);

	const capacityDetails = uzeStore((s) => s.capacityDetails);


	const day = uzeStore((s) => s.day);
	const infoBoxRef = uzeStore((s) => s.infoBoxRef);
	const pageTime = uzeStore((s) => s.pageTime);
	const headcount = uzeStore((s) => s.headcount);
	const UPH = uzeStore((s) => s.UPH);
	const TBCPT = uzeStore((s) => s.TBCPT);



	const fullInfo = uzeStore((s) => s.fullInfo);

	if (!pickedQuery.response?.datas) return
	const [response] = pickedQuery.response.datas
	const dataTotal = response.data

	return (
		<>
			<div className="grid grid-cols-4">
				{Object.keys(posteMapping).map((ligne) => {
					const lineNumber = ligne.substring(5, 6);
					return (
						<div key={ligne} className="text-center">
							<div className="flex flex-row justify-evenly">
								<span className="font-bold">
									{'Ligne ' + lineNumber}
								</span>
								<HeadCount
									headcount={mapping}
									ligne={'ligne' + lineNumber}
								/>
								{lineNumber === '3' ? (
									<RenderBuffer
										dz={'dz-P-OB-Single-CartRunMove'}
									/>
								) : (
									<RenderBuffer
										dz={'dz-P-OB-Single-Line' + lineNumber}
									/>
								)}
							</div>
							{Object.values(posteMapping[ligne]).map((poste) => <Poste poste={poste}/>)}
						</div>
					);
				})}
			</div>
		</>
	);
}
