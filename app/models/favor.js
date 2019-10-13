const { Model, Sequelize } = require('sequelize')

const { sequelize } = require('./../../core/db')
const { Art } = require('./../models/art')
const { LikeError,DislikeError } = require('./../../core/http-exception')
/* 业务表 */
class Favor extends Model {
    static async like (art_id,type,uid) {
        // 1. 添加一条记录
        // 2. 修改fav_nums 字段数据
        // 数据库事务 保证数据的一致性  ACID 原子性 一致性 隔离性 持久性
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })
        if (favor) {
            throw new LikeError()
        }
        // 数据库事务操作
        return sequelize.transaction(async t => {
            await Favor.create({
                art_id,
                type,
                uid
            },{transaction:t})
            const art = await Art.getData(art_id,type, false)
            await art.increment('fav_nums',{by:1,transaction:t})
        })
    }

    static async dislike(art_id,type,uid) {
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })
        if (!favor) {
            throw new DislikeError()
        }
        // 数据库事务操作
        return sequelize.transaction(async t => {
            await favor.destroy({
                force: true,  // false 假删除 true 物理删除
                transaction:t
            })
            const art = await Art.getData(art_id,type, false)
            await art.decrement('fav_nums',{by:1,transaction:t})
        })
    }

    static async userLikeIt(art_id,type,uid) {
        const favor = await Favor.findOne({
            where: {art_id,type,uid}
        })
        return favor ? true : false
    }
}
Favor.init({
    uid:Sequelize.INTEGER,
    art_id:Sequelize.INTEGER,
    type:Sequelize.INTEGER,
},{
    sequelize,
    tableName: 'favor'
}
)

module.exports = {
    Favor
}