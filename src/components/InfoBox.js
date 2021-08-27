import React, { useState, useEffect } from "react";
import moment from 'moment'
import "./InfoBox.css";

const InfoBox = props => {
	const [profileState, setProfileState] = useState(props);
	const [dataPrices , setData] = useState({
		currentPrice: null,
		periodChangeD: null,
		periodChangeP: null,
		updatedAt: null	
	})
	useEffect(() => {
		const getData = () => {
			const data = profileState.data;
			const url = "https://api.coindesk.com/v1/bpi/currentprice.json";

			fetch(url).then((r) => r.json()).then((bitcoinData) => {
				const price = bitcoinData.bpi.USD.rate_float;
				const change = price - data[0].y;
				const changeP = ((price - data[0].y) / data[0].y) * 100;
				setData({
					currentPrice: bitcoinData.bpi.USD.rate_float,
					monthChangeD: change.toLocaleString('us-EN',{ style: 'currency', currency: 'USD' }),
					monthChangeP: changeP.toFixed(2) + '%',
					updatedAt: bitcoinData.time.updated
				})

				console.log(price);
			}).catch(err => {
				console.log(err);
			});
		}
		getData();
	},[]);
	return (
		<div id="data-container">
			{ dataPrices.currentPrice ?
				<div id="left" className='box'>
					<div className="heading">{dataPrices.currentPrice.toLocaleString('us-EN',{ style: 'currency', currency: 'USD' })}</div>
					<div className="subtext">{'Updated ' + moment(dataPrices.updatedAt ).fromNow()}</div>
				</div>
			: null}
			{ dataPrices.currentPrice ?
			<div id="middle" className='box'>
				<div className="heading">{dataPrices.monthChangeD}</div>
				<div className="subtext">Change Since Last Month (USD)</div>
			</div>
			: null}
			<div id="right" className='box'>
				<div className="heading">{dataPrices.monthChangeP}</div>
				<div className="subtext">Change Since Last Month (%)</div>
			</div>
		</div>
	);
}

export default InfoBox;
