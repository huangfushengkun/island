const {sequelize} = require('./../../core/db')
const axios = require('axios')
const util = require('util')
const { Favor } = require('./favor')
const {
    Sequelize,
    Model
} = require('sequelize')




class Book extends Model {
    // constructor (id) {
    //     super()
    //     this.id = id
    // }
    async detail (id) {
        // url
        const url = util.format(global.config.yushu.detailUrl, id)
        const detail = await axios.get(url)
        return detail.data
    }

    static async getMyFavorBookCount(uid) {
        const count = await Favor.count({
            where:{
                type:400,
                uid
            }
        })
        return count
    }

    static async searchFromYuShu (q, start, count,summary=1) {
        const url = util.format(global.config.yushu.keywordUrl, encodeURI(q), count, start,summary)
        const detail = await axios.get(url)
        return detail.data
    }
}

Book.init({
    id: {  //定义book id 主键 不是自增长 
        type: Sequelize.INTEGER,
        primaryKey:true
    },
    fav_nums: {
        type:Sequelize.INTEGER,
        defaultValue:0
    }
},{
    sequelize,
    tableName: 'book'
})

module.exports = {
    Book
}