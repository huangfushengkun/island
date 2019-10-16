const { sequelize } = require('./../../core/db')
const { Model, Sequelize } = require('sequelize')


class Comment extends Model {

    static async addCommment (bookId, content) {
        const comment = await Comment.findOne({
            where: {
                book_id: bookId,
                content
            }
        })
        if (!comment) {
            return await Comment.create({
                book_id: bookId,
                content,
                nums: 1
            })
        } else {
            return await comment.increment('nums', {
                by: 1,
            })
        }

    }

}

Comment.init({
    content: Sequelize.STRING(12),
    nums: {
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    book_id:Sequelize.INTEGER
},{
    sequelize,
    tableName: 'comment'
})


module.exports = {
    Comment
}