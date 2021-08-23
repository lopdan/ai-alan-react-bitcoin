import alanButton from '@alan-ai/alan-sdk-web';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './App.css';

import InfoBox from './components/InfoBox';

const alan_SDK_key = 'c1344b0e5cda4dfcd27bc949d44adcca2e956eca572e1d8b807a3e2338fdd0dc/stage';

const App = () => {
  const[dataValues, updateData] = useState({
    fetchingData: true,
    data: null,
    hoverLoc: null,
    activePoint: null
  })
	useEffect(() => {
		alanButton({
			key: alan_SDK_key,
			onCommand: ({ command }) => {
				if(command === 'testCommand'){
					alert('Test succesful');
				}
			}
		})
	}, [])

  useEffect(() => {
    const getData = () => {
        const url = 'https://api.coindesk.com/v1/bpi/historical/close.json';  
        fetch(url).then(r => r.json())
          .then((bitcoinData) => {
            const sortedData = [];
            let count = 0;
            for (let date in bitcoinData.bpi){
              sortedData.push({
                d: moment(date).format('MMM DD'),
                p: bitcoinData.bpi[date].toLocaleString('us-EN',{ style: 'currency', currency: 'USD' }),
                x: count, //previous days
                y: bitcoinData.bpi[date] // numerical price
              });
              count++;
            }
            updateData({
                data: sortedData,
                fetchingData: false
            })
          })
          .catch((e) => {
            console.log(e);
          });
      }
	  console.log(dataValues);
      getData();
  },[dataValues.activePoint])

    return (

      <div className='container'>
        <div className='row'>
          <h1>30 Day Bitcoin Price Chart</h1>
        </div>
        <div className='row'>
          { !dataValues.fetchingData ?
          <InfoBox data={dataValues.data} />
          : null }
        </div>
        <div className='row'>
          <div className='popup'>
          </div>
        </div>
        <div className='row'>
          <div className='chart'>
          </div>
        </div>
        <div className='row'>
          <div id="coindesk"> Powered by <a href="http://www.coindesk.com/price/">CoinDesk</a></div>
        </div>
      </div>

    );
}

export default App;