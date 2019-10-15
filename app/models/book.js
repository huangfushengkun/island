const {sequelize} = require('./../../core/db')
const axios = require('axios')
const util = require('util')

const {
    Sequelize,
    Model
} = require('sequelize')




class Book extends Model {
    constructor (id) {
        super()
        this.id = id
    }
    async detail () {
        // url
        const url = util.format(global.config.yushu.detailUrl, this.id)
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
        default:0
    }
},{
    sequelize,
    tableName: 'book'
})

module.exports = {
    Book
}