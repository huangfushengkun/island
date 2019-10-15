const Router = require('koa-router')  //引入koa router
const { HotBook } = require('./../../models/hot-book')
const { Book } = require('./../../models/book')
const { PositiveIntegerValidator } = require('./../../validator/validator')
const router = new Router({
    prefix: '/v1/book'
})

router.get('/host_list', async (ctx, next) => {
    const books = await HotBook.getAll()
    ctx.body = {books: books}
})

router.get('/:id/detail', async (ctx, next) => {
    const v = await new PositiveIntegerValidator().validate(ctx)
    
    const book = new Book(v.get('path.id'))
    
    ctx.body = await book.detail()
})


module.exports = router