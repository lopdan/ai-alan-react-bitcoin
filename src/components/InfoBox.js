import React, { useState, useEffect } from "react";
import "./InfoBox.css";

const InfoBox = () => {
	const [data , setData] = useState({
		currentPrice: null,
		periodChangeD: null,
		periodChangeP: null,
		//updatedAt: null,	
	})
	const dataChangeHandler = e => {
		setData({...data, [e.target.name]: e.target.value})
	}	

	const loadPriceDate = () => {
		const url = "https://api.coindesk.com/v1/bpi/currentprice.json";
		fetch(url).then((r) => r.json()).then((bitcoinData) => {
			const price = bitcoinData.bpi.USD.rate_float;
			//const change = price - data[0].y;
			const changeP = ((price - data[0].y) / data[0].y) * 100;

			dataChangeHandler({
				currentPrice : bitcoinData.bpi.USD.rate_float,
				periodChangeD: '',
				periodChangeP: changeP.toFixed(2) + "%",
			})
		}).catch((e) => {
			console.log(e);
		});
	}
	/*useEffect(() => {
		loadPriceDate();
	}, [count]);*/

	return(
		<div id="data-container" loadPriceDate={() => void 0}>
			{data.currentPrice ? (
				<div id="left" className="box">
				<div className="heading">
					{data.currentPrice.toLocaleString("us-EN", {
						style: "currency",
						currency: "USD",
					})}
				</div>
				<div className="subtext">
					{"Updated X"}
				</div>
				</div>
			) : null}
			{data.currentPrice ? (
				<div id="middle" className="box">
				<div className="heading">{data.periodChangeD}</div>
				<div className="subtext">Change Since Last X (USD)</div>
				</div>
			) : null}
			<div id="right" className="box">
				<div className="heading">{data.periodChangeP}</div>
				<div className="subtext">Change Since Last X (%)</div>
			</div>
		</div>
	);
  
}

export default InfoBox;
