import React, { useState, useEffect } from "react";
import "./InfoBox.css";

const InfoBox = props => {
	const [profileState, setProfileState] = useState(props);
	const [dataPrices , setData] = useState({
		currentPrice: null,
		periodChangeD: null,
		periodChangeP: null,
		updatedAt: null	
	})
	const dataChangeHandler = e => {
		setData({...dataPrices, [e.target.name]: e.target.value})
	}	

	useEffect(() => {
		const getData = () => {
			console.log(profileState);
			const {data} = profileState.data;
			const url = "https://api.coindesk.com/v1/bpi/currentprice.json";
			fetch(url).then((r) => r.json()).then((bitcoinData) => {
				const price = bitcoinData.bpi.USD.rate_float;
				const change = price - data[0].y;
				const changeP = ((price - data[0].y) / data[0].y) * 100;

				/*dataChangeHandler({
					currentPrice : bitcoinData.bpi.USD.rate_float,
					periodChangeD: '',
					periodChangeP: changeP.toFixed(2) + "%",
				})*/
				setData({
					currentPrice : bitcoinData.bpi.USD.rate_float,
					periodChangeD: '',
					periodChangeP: changeP.toFixed(2) + "%",
				})

				console.log(price);
			}).catch(err => {
				console.log(err);
			});
		}
		console.log(dataPrices);
		getData();
	}, [dataPrices]);
	
	return(
		<div id="data-container" loadPriceDate={() => void 0}>
			{dataPrices.currentPrice ? (
				<div id="left" className="box">
				<div className="heading">
					{dataPrices.currentPrice.toLocaleString("us-EN", {
						style: "currency",
						currency: "USD",
					})}
				</div>
				<div className="subtext">
					{"Updated X"}
				</div>
				</div>
			) : null}
			{dataPrices.currentPrice ? (
				<div id="middle" className="box">
				<div className="heading">{dataPrices.periodChangeD}</div>
				<div className="subtext">Change Since Last X (USD)</div>
				</div>
			) : null}
			<div id="right" className="box">
				<div className="heading">{dataPrices.periodChangeP}</div>
				<div className="subtext">Change Since Last X (%)</div>
			</div>
		</div>
	);
  
}

export default InfoBox;
