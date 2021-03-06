const { Sequelize, Model} = require('sequelize')
const { unset, clone, isArray } = require('lodash')

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
        // createdAt: 'created_at',
        // updatedAt: 'updated_at',
        // deletedAt: 'deleted_at',
        underscored:true,  // 驼峰命名 -> 下划线
        scopes: {
            bh: {
                attributes: {
                    exclude: ['updatedAt', 'deletedAt', 'createdAt']
                }
            }
        }
    }
})

sequelize.sync({
    force:false  //启动服务时清空数据库
})

Model.prototype.toJSON = function() {
    let data = clone(this.dataValues)
    unset(data, 'updatedAt')
    unset(data, 'createdAt')
    unset(data, 'deletedAt')

    for(key in data) {
    if (key === 'image') {
        if (!data[key].startsWith('http')) {
        data[key] = host + data[key]
        }
    }
    }

    if(isArray(this.exclude)){
    this.exclude.forEach(
        (value)=>{
        unset(data,value)
        }
    )
    }

    return data
}

module.exports = {
    sequelize
}