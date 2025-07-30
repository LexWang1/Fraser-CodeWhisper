// //we use ORM to manage the databse table
// import Sequelize from 'sequelize';
// //require('dotenv').config();//Use node --env-file=.env xxxxx

// console.log(process.env.DB_HOST);
// console.log(process.env.DB_NAME);
// console.log(process.env.DB_PASS);
// console.log(process.env.DB_USER);
// console.log(process.env.API_KEY);


// // const MysqlConnect = new Sequelize('financial_app', 'root', 'n3u3da!', {
// //   define: {
// //     timestamps: false, // 全局默认不要 createAt 和 updateAt，自动管理时间
// //   },
// //   dialect: 'mysql', // 数据库类型，| 'mariadb' | 'postgres' | 'mssql'
// //   host: '127.0.0.1', // ip
// //   port: 3306, // 端口
// //   logging: (msg) => { // 日志信息，打印出每个操作生成的具体的 sql语句
// //     console.log('msg: ', msg);
// //   },
// //   timezone: '+08:00', // 时区，在中国就是 +8
// // });

// // function PersonModel(sequelize, DataTypes) {
// //     return sequelize.define(
// //       "person", // 给模型自定义个名字，通常是表名的驼峰写法
// //       {
// //         id: {
// //           type: DataTypes.BIGINT, // 数据类型，有 String、Date 等等
// //           allowNull: true, // 是否允许为空
// //           primaryKey: true, // 是否主键
// //           autoIncrement: true, // 是否自增
// //           comment: "id", // 备注
// //         },
// //       },
// //       {
// //         sequelize,
// //         tableName: "person", // 表名称
// //       }
// //     );
// //   };

// //   function PersonModel(sequelize, DataTypes) {
// //     return sequelize.define(
// //       "person", // 给模型自定义个名字，通常是表名的驼峰写法
// //       {
// //         id: {
// //           type: DataTypes.BIGINT, // 数据类型，有 String、Date 等等
// //           allowNull: true, // 是否允许为空
// //           primaryKey: true, // 是否主键
// //           autoIncrement: true, // 是否自增
// //           comment: "id", // 备注
// //         },
// //       },
// //       {
// //         sequelize,
// //         tableName: "person", // 表名称
// //       }
// //     );
// //   };

