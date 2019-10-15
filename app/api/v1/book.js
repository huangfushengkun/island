const Router = require('koa-router')  //引入koa router
const { HotBook } = require('./../../models/hot-book')
const router = new Router()

router.get('/v1/book/host_list', async (ctx, next) => {
    const books = await HotBook.getAll()
    ctx.body = {books: books}
})

module.exports = router