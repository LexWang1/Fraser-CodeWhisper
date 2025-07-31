// Import axios
import axios from 'axios';
import fetch from 'node-fetch';

// const axios = require('axios');

const symbol = '^GSPC'; //index use ^ at the head, stock use ticket name
const interval = '1m'; // 1 day     1m 1d 1mo 1y 
const range = '1m'; // 1 month   1m 1d 1mo 1y 
const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

axios.get(url)   
  .then(response => {
    console.log('Historical Data from now:', response.data.chart.result[0].indicators.quote[0]);
  })
  .catch(error => {
    console.error('Error:', error);
  });
//  price is all USD


// const axios = require('axios'); // or use CDN in browser

// Fetch BTC price in USD
let coinName = "bitcoin";
let currency = "usd";
let daily_range = "100";
fetch(`https://api.coingecko.com/api/v3/coins/${coinName}/market_chart?vs_currency=${currency}&days=${daily_range}`)
  .then(response => response.json())
  .then(data => {console.log(`Crypto ${coinName}:`);
                console.log(data);
});
// axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=${currency}`)
//   .then(response => {
//     console.log(`${coinName} Price:`, response.data.bitcoin.usd);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });

//   axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
//   .then(response => {
//     console.log('Top 10 Cryptos:', response.data);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
// let url_coin = `https://api.coincap.io/v2/assets/${coinName}/history`;
// axios.get(url_coin,{
//     params : {
//         "interval": "d1",
//         "start": "1483228800000", // # 2017-01-01 的时间戳
//         "end": "1649193600000"     //# 2022-04-05 的时间戳
//     }
// })
//   .then(response => {
//     console.log(response);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });

const fundSymbol = 'VFINX'; // Vanguard 500 Index Fund
let fund_interval = '1m';
let fund_range = '1m';
const fund_url = `https://query1.finance.yahoo.com/v8/finance/chart/${fundSymbol}?interval=${fund_interval}&range=${fund_range}`;
axios.get(fund_url)
  .then(response => {
    const historicalData = response.data.chart.result[0].indicators.quote[0];
    console.log('Historical Fund Prices:', historicalData);
  })
  .catch(error => {
    console.error('Error fetching Yahoo Finance data:', error);
  });



  //foreign exchange
const date = '2023-10-01'; // Historical date
axios.get(`https://api.frankfurter.app/${date}?from=EUR&to=USD`)
    .then(response => {
      const historicalRate = response.data.rates.USD;
      console.log(`EUR to USD on ${date}: ${historicalRate}`);
    })
    .catch(error => {
      console.error('Error:', error);
    });



//news api
// let key_word = 'apple';
// axios.get(`https://www.baidu.com/s?wd=${key_word}`, {
//   headers: {
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//   },
// })
// .then(response=>{
//   // console.log(response);
//   return response.data;
// })
// .then(data=>{
//   // console.log(data);

// });  


    