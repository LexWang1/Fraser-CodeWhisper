const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost', user: 'root', password: 'SUPERljy@981002', database: 'financial_data',
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

app.listen(port, () => {
    console.log(`数据接口服务已启动，正在监听 http://localhost:${port}`);
    console.log("-----------------------------------------------------");
    console.log("请注意：查询参数已从 'type' 变更为 'asset_type'!");
    console.log("新闻接口示例: http://localhost:3000/api/news?asset_type=Stock&symbol=TSLA");
    console.log("价格接口示例: http://localhost:3000/api/asset_price?asset_type=Crypto&name=bitcoin&date=2025-6-27");
    console.log("-----------------------------------------------------");
});