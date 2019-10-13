const Sequelize = require('sequelize')
const {
    dbName,
    host,
    port,
    user,
    password
} = require('./../config/config').database
/* 
sequelize 数据库操作
接收四个参数
第四个参数是一个对象
{
    dialect: 'mysql' , //数据库类型

    logging: true, //是否显示具体的SQL操作
    timezone: '+08:00', // 时区
}

最后导出  sequelize

*/
const sequelize = new Sequelize(dbName,user,password,{
    dialect: 'mysql' ,
    host ,
    port ,
    logging: true,

    timezone: '+08:00',
    define: {
        // create_time  update_time   delete_time
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored:true
    }
})

sequelize.sync({
    force:false  //启动服务时清空数据库
})

module.exports = {
    sequelize
}