
const { sequelize } = require('./../../core/db')
const { Model, Sequelize } = require('sequelize');

const classicFields = {
    image: Sequelize.STRING,
    content: Sequelize.STRING,
    pubdate: Sequelize.DATEONLY,
    fav_nums: Sequelize.INTEGER,
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
