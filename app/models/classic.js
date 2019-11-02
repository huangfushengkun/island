
const { sequelize } = require('./../../core/db')
const { Model, Sequelize } = require('sequelize');

const classicFields = {
    image: {
        type: Sequelize.STRING,
        get() {
            return global.config.host + this.getDataValue('image')
        }
    },
    content: Sequelize.STRING,
    pubdate: Sequelize.DATEONLY,
    fav_nums:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    title: Sequelize.STRING,
    type: Sequelize.TINYINT,
}

class Movie extends Model {
    
}
/* 
    1. 模型的字段
    2. sequelize 实例
    3. tableName  
*/
Movie.init(classicFields,{
    sequelize,
    tableName: 'movie'
})

class Sentence extends Model {
    
}

Sentence.init(classicFields,{
    sequelize,
    tableName: 'sentence'
})


class Music extends Model {
    
}

Music.init({
    url: Sequelize.STRING,
    ...classicFields
},{
    sequelize,
    tableName: 'music'
})

module.exports = {
    Movie, Sentence, Music
}
