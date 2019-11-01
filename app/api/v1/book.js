const Router = require('koa-router')  //引入koa router
const { HotBook } = require('./../../models/hot-book')
const { Book } = require('./../../models/book')
const { Comment } = require('./../../models/book_comment')
const { Favor } = require('./../../models/favor')
const { 
    PositiveIntegerValidator,
    SeachValidator,
    AddShortCommentValidator
} = require('./../../validator/validator')
const { Auth } = require('./../../../middlewares/auth')
const { success } = require('./../../lib/helper')
const router = new Router({
    prefix: '/v1/book'
})
/* 获取热门书籍列表 */
router.get('/hot_list', async (ctx, next) => {
    const books = await HotBook.getAll()
    ctx.body = books
})
/* 获取书籍的详细信息 */
router.get('/:id/detail', async (ctx, next) => {
    const v = await new PositiveIntegerValidator().validate(ctx)
    
    const book = new Book()
    
    ctx.body = await book.detail(v.get('path.id'))
})
/* 搜索接口 */
router.get('/search', async (ctx, next) => {
    const v = await new SeachValidator().validate(ctx)

    const result = await Book.searchFromYuShu(v.get('query.q'), v.get('query.start'), v.get('query.count'))
    
    ctx.body = result
})

/* 获取我喜欢书籍的数量 */
router.get('/favor/count', new Auth().m, async ctx => {
    const count = await Book.getMyFavorBookCount(ctx.auth.uid)
    ctx.body = { count }
})

/* 获取某一本书籍点赞的情况 */
router.get('/:book_id/favor', new Auth().m, async ctx => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'book_id' //传入验证器别名
    })
    const favor = await Favor.getBookFavor(ctx.auth.uid,v.get('path.book_id'))
    ctx.body = favor
})

/* 增加短评接口 */
router.post('/add/short_comment', new Auth().m, async ctx => {
    const v = await new AddShortCommentValidator().validate(ctx, {
        id:'book_id'
    })
    Comment.addCommment(v.get('body.book_id'),v.get('body.content'))
    success()
})
/* 短评查询 */
router.get('/:book_id/short_comment', new Auth().m, async ctx => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'book_id' //传入验证器别名
    })
    const book_id = v.get('path.book_id')
    const comments = await Comment.getComments(book_id)
    ctx.body = {
        comments,
        book_id
    }
})

module.exports = router