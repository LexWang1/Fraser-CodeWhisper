import fetch from 'node-fetch';
import axios from 'axios';
import { response } from 'express';

const symbol = 'TSLA'; //index use ^ at the head, stock use ticket name
const interval = '1m'; // 1 day     1m 1d 1mo 1y 
const range = '1m'; // 1 month   1m 1d 1mo 1y 
const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

axios.get(url)   //必须用axios.get
  .then(response => {
    console.log('Historical Data from now:', response.data.chart.result[0].indicators.quote[0]["close"][0]);
  })
  .catch(error => {
    console.error('Error:', error);
  });


fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Historical Data from now:', data.chart.result[0].indicators.quote[0]["close"][0]);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  