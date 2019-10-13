const { sequelize } = require('./../../core/db')
const { Model, Sequelize } = require('sequelize')

class Flow extends Model {

}
// 业务表
Flow.init({
    index: Sequelize.INTEGER,    //期刊序号
    art_id: Sequelize.INTEGER,  //实体id号  可以是artId驼峰命名 到数据库中都是 _命名
    type: Sequelize.INTEGER    // type：100 movie， 200 music， 300 sentence
},{
    sequelize,
    tableName: 'flow'
})

module.exports = {
    Flow
}