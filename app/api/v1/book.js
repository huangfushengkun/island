const Router = require('koa-router')  //引入koa router

const router = new Router()

router.get('/v1/book/latest', (ctx, next) => {
    ctx.body = {name: 'huangfu'}
})

module.exports = router