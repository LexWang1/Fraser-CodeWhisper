const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const dbConfig = { host: 'localhost', user: 'root', password: 'qwe123rty' };
const dbName = 'financial_data';
const newsCsvPath = path.join(__dirname, '..', 'data', 'financial_news.csv');
const priceCsvPath = path.join(__dirname, '..', 'data', 'asset_price.csv');

// --- 核心修正之处：在创建CSV解析器时，增加 mapHeaders 选项 ---
const csvOptions = {
    mapHeaders: ({ header }) => header.trim() // trim() 函数会移除字符串两端的任何空格或不可见字符
};
// ---------------------------------------------------------------

async function setupDatabase() {
    let connection;
    try {
        // 1. 清理并创建数据库
        connection = await mysql.createConnection(dbConfig);
        await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
        console.log(`旧数据库 '${dbName}' 已被清理。`);
        await connection.query(`CREATE DATABASE \`${dbName}\`;`);
        await connection.changeUser({ database: dbName });
        console.log(`已成功创建并切换到全新的数据库 '${dbName}'。`);

        // 2. 创建表结构
        const createNewsTableQuery = `CREATE TABLE financial_news (id INT AUTO_INCREMENT PRIMARY KEY, asset_type VARCHAR(50), symbol VARCHAR(50), datetime DATETIME, headline VARCHAR(255), source VARCHAR(255), url VARCHAR(512), summary TEXT, INDEX(asset_type, symbol));`;
        await connection.query(createNewsTableQuery);
        const createPricesTableQuery = `CREATE TABLE asset_prices (id INT AUTO_INCREMENT PRIMARY KEY, asset_type VARCHAR(50), name VARCHAR(50), date DATE, price DECIMAL(20, 10), UNIQUE KEY unique_asset_date (asset_type, name, date));`;
        await connection.query(createPricesTableQuery);
        console.log("所有表结构已创建完毕。");

        // 3. 导入数据 (使用我们带选项的解析器)
        console.log('\n开始导入 financial_news.csv...');
        const newsStream = fs.createReadStream(newsCsvPath).pipe(csv(csvOptions)); // <-- 应用选项
        for await (const row of newsStream) {
            const query = 'INSERT IGNORE INTO financial_news (asset_type, symbol, datetime, headline, source, url, summary) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const params = [ row.asset_type || null, row.symbol || null, row.datetime || null, row.headline || null, row.source || null, row.url || null, row.summary || null ];
            await connection.execute(query, params);
        }
        console.log('financial_news.csv 导入成功！');
        
        console.log('\n开始导入 asset_price.csv...');
        const priceStream = fs.createReadStream(priceCsvPath).pipe(csv(csvOptions)); // <-- 应用选项
        for await (const row of priceStream) {
            const query = 'INSERT IGNORE INTO asset_prices (asset_type, name, date, price) VALUES (?, ?, ?, ?)';
            let price = parseFloat(row.price);
            if (isNaN(price)) { price = null; }
            const params = [ row.asset_type || null, row.name || null, row.date || null, price ];
            await connection.execute(query, params);
        }
        console.log('asset_price.csv 导入成功！');

    } catch (error) {
        console.error('数据库设置失败:', error);
    } finally {
        if (connection) await connection.end();
        console.log('\n所有操作已完成，数据库连接已关闭。');
    }
}

// 执行！
setupDatabase();