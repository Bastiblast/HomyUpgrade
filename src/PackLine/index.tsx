import { uzeStore } from '../store/uzeStore';
import RenderBuffer from './Buffer';
import HeadCount from './HeadCount';
import Poste from './Poste';

export default function PackLine() {

	const posteMapping = uzeStore((s) => s.singleLaneMapping);
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
