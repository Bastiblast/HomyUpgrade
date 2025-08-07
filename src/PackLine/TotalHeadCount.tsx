import React, { useContext, useEffect, useState } from 'react';
import { uzeStore } from '../store/uzeStore';
import { DataCenterContext } from '@/query/datacenter-contextAndProvider';

export default function TotalHeadCount() {
	const {boardHeadcount} = useContext(DataCenterContext)




	return <h2 className="text-3xl">TotalHeadCount: {boardHeadcount}</h2>;
}
