const { sequelize } = require('./../../core/db')
const { Model, Sequelize } = require('sequelize')
const { NotFound } = require('../../core/http-exception')
const { Art } = require('./../models/art')
const { Favor } = require('./../models/Favor')

class Flow extends Model {
    static async getNextOrPrevous (index, uid) {
        const flow = await Flow.findOne({
            where: {
                index
            }
        })

        if (!flow) {
            throw new NotFound()
        }
        const art = await Art.getData(flow.art_id,flow.type)
        const likeNext = await Favor.userLikeIt(flow.art_id,flow.type, uid)
        art.setDataValue('index',flow.index)
        art.setDataValue('like_status',likeNext)
        return art
    }

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