const express = require('express');
const axios = require('axios');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3088;
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost', user: 'root', password: 'qwe123rty', database: 'financial_data',
    waitForConnections: true, connectionLimit: 10, queueLimit: 0
});

// 查询参数变更为 asset_type
app.get('/api/news', async (req, res) => {
    const { asset_type, symbol } = req.query;
    if (!asset_type || !symbol) return res.status(400).json({ error: '必须提供 "asset_type" 和 "symbol" 参数' });

    try {
        // 按 asset_type 列进行查询
        const query = 'SELECT datetime, headline, source, url, summary FROM financial_news WHERE asset_type = ? AND symbol = ? ORDER BY datetime DESC';
        const [rows] = await pool.execute(query, [asset_type, symbol]);
        res.json(rows);
    } catch (error) {
        console.error('查询新闻数据失败:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 查询参数变更为 asset_type
app.get('/api/asset_price', async (req, res) => {
    const { asset_type, name, date } = req.query;
    if (!asset_type || !name || !date) return res.status(400).json({ error: '必须提供 "asset_type", "name", 和 "date" 参数' });

    try {
        // 按 asset_type 列进行查询
        const query = 'SELECT price FROM asset_prices WHERE asset_type = ? AND name = ? AND date = ?';
        const [rows] = await pool.execute(query, [asset_type, name, date]);
        
        if (rows.length > 0) {
            // 在原始返回的数组中添加一个额外的元素，让数据更清晰
            rows.push({"note": "This is the price data for the given asset."});
            res.json(rows);
        } else {
            res.status(404).json({ message: '未找到指定数据' });
        }
    } catch (error) {
        console.error('查询资产价格失败:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

app.get('/currentStock/:ticket', (req, res) => {
  // 获取路由参数并保存到变量
  let symbol = req.params.ticket;
//   const symbol = 'TSLA'; //index use ^ at the head, stock use ticket name
  const interval = '1m'; // 1 day     1m 1d 1mo 1y 
  const range = '1m'; // 1 month   1m 1d 1mo 1y 
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

  axios.get(url)   //必须用axios.get
  .then(response => {
    console.log('Stock Price from now:', response.data.chart.result[0].indicators.quote[0]["close"][0]);
    res.send(response.data.chart.result[0].indicators.quote[0]["close"][0]);
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

app.get('/currentFund/:ticket',(req,res)=>{
    let fundSymbol = req.params.ticket;
    // const fundSymbol = 'VFINX'; // Vanguard 500 Index Fund
    let fund_interval = '1m';
    let fund_range = '1m';
    const fund_url = `https://query1.finance.yahoo.com/v8/finance/chart/${fundSymbol}?interval=${fund_interval}&range=${fund_range}`;
axios.get(fund_url)
  .then(response => {
    const historicalData = response.data.chart.result[0].indicators.quote[0]["close"][0];
    console.log('Historical Fund Prices:', historicalData);
    res.send(historicalData);
  })
  .catch(error => {
    console.error('Error fetching Yahoo Finance data:', error);
  });
});

app.get('/currentCrypto/:ticket',(req,res)=>{
    let Symbol = req.params.ticket;
    
    let currency = "usd"; //usd as price
    let daily_range = "1";
    axios.get(`https://api.coingecko.com/api/v3/coins/${Symbol}/market_chart?vs_currency=${currency}&days=${daily_range}`)
      .then(response => {
        console.log(`Crypto ${Symbol} Price:`, response.data["prices"][0][1]);
        res.send(response.data["prices"][0][1]);
      }).catch(error =>{console.log("test:", Symbol);}
        
      );
});

//foreign exchange api
app.get('/currentExchange/:ticket',(req,res)=>{
    let Symbol = req.params.ticket;
    let currency = "USD"; //usd as price
    const date = '2025-07-31'; // Historical date
    axios.get(`https://api.frankfurter.app/${date}?from=${Symbol}&to=${currency}`)
    .then(response => {
      const historicalRate = response.data.rates.USD;//得到一个double，每个外币相对美元的单价
      console.log(`${Symbol} to ${currency} on ${date}: ${historicalRate}`);
    //   console.log(`Crypto ${Symbol} Price:`, response.data["prices"][0][1]);
      res.send(historicalRate);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});


app.listen(port, () => {
    console.log(`数据接口服务已启动，正在监听 http://localhost:${port}`);
    // console.log("-----------------------------------------------------");
    // console.log("请注意：查询参数已从 'type' 变更为 'asset_type'!");
    // console.log("新闻接口示例: http://localhost:3000/api/news?asset_type=Stock&symbol=TSLA");
    // console.log("价格接口示例: http://localhost:3000/api/asset_price?asset_type=Crypto&name=bitcoin&date=2025-6-27");
    // console.log("-----------------------------------------------------");
});