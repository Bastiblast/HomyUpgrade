import { useContext, useEffect, useRef } from 'react';
import { uzeStore } from '../store/uzeStore';
import RenderTote from './Tote';
import RenderBuffer from './Buffer';
import HeadCount from './HeadCount';
import AssociateInput from './AssociateInput';
import searchOnRodeo from './onRodeoSearch';
import fetchRodeoIco from '../BonusButton/fetch-rodeo-ico';
import { DataCenterContext } from '@/query/datacenter-contextAndProvider';

export default function PackLine() {

	const {pickedQuery} = useContext(DataCenterContext)
	const ico = useRef(null);

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
									headcount={headcount}
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
							{Object.values(posteMapping[ligne]).map((poste) => {
								let renderUnits,
									railUnit,
									wsUnit,
									stationUnits,
									stationCPT,
									wsCPT,
									nextCPT,
									remaingTime,
									timeToFinish,
									stationColor,
									potentiel;
								if (dataTotal) {
									railUnit =
										dataTotal[`dz-P-OB-Single-cvg-${poste}`]
											?.total;
									wsUnit =
										dataTotal[`ws_Singles_0${poste}`]
											?.total;
									stationUnits =
										railUnit && wsUnit
											? railUnit + wsUnit
											: railUnit
												? railUnit
												: wsUnit;
									//console.log(poste,stationUnits,{railUnit},{wsUnit})
									renderUnits = isNaN(stationUnits)
										? null
										: stationUnits;

									wsCPT =
										dataTotal[`ws_Singles_0${poste}`]
											?.NextCPT;
									stationCPT =
										dataTotal[`dz-P-OB-Single-cvg-${poste}`]
											?.NextCPT;
									nextCPT =
										wsCPT < stationCPT ? wsCPT : stationCPT;
									remaingTime =
										(Date.parse(nextCPT) - pageTime) /
										1000 /
										60 /
										60;

									timeToFinish = renderUnits / UPH;
									potentiel =
										remaingTime -
										(timeToFinish + TBCPT / 60);
									stationColor =
										potentiel > 0 || isNaN(potentiel)
											? 'flex flex-row shrink items-center bg-violet-400 p-1 m-1 justify-between rounded-md'
											: 'flex flex-row shrink items-center bg-red-400 p-1 m-1 justify-between rounded-md';
								}

								const stationSearchParams = `dz-P-OB-Single-cvg-${poste}+ws_Singles_0${poste}`;
								return (
									<div
										className={stationColor}
										key={'L1' + '-' + poste}
									>
										<div className="flex flex-row items-center w-full">
											<div className="relative">
												<span className="bg-lime-400 p-2 rounded-md">
													{String(poste)}
												</span>
												{renderUnits && (
													<img
														onClick={() =>
															searchOnRodeo(
																stationSearchParams,
															)
														}
														className="-top-1 right-0 z-10 absolute w-4 h-1/2 hover:scale-150 transition-all hover:-translate-x-1 hover:translate-y-1"
														ref={ico}
														src="https://rodeo-dub.amazon.com/resources/images/rodeo-favicon.gif"
													></img>
												)}
											</div>
											<div className="flex flex-row">
												<AssociateInput poste={poste} />
											</div>

											<div className="flex flex-row">
												<RenderTote
													data={dataTotal}
													inductPrio={{
														prioCPT: nextCPT,
														potentiel,
													}}
													dropzone={
														'ws_Singles_0' + poste
													}
													day={day}
													infoBoxRef={infoBoxRef}
												/>
												<div className="mx-0 p-0 divider divider-horizontal"></div>
												<RenderTote
													data={dataTotal}
													inductPrio={{
														prioCPT: nextCPT,
														potentiel,
													}}
													dropzone={
														'dz-P-OB-Single-cvg-' +
														poste
													}
													day={day}
													infoBoxRef={infoBoxRef}
												/>
											</div>
										</div>
										<div className="w-12">
											{fullInfo &&
												renderUnits &&
												renderUnits !== 0 &&
												renderUnits + '/u'}{' '}
											{fullInfo &&
												timeToFinish !== 0 &&
												(timeToFinish * 60).toFixed(0) +
													'/m'}
										</div>
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</>
	);
}
