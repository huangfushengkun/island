const Router = require('koa-router')  //引入koa router
const router = new Router({
    prefix: '/v1/classic'
})
const { Flow } = require('./../../models/flow')

const { PositiveIntegerValidator, ClassicValidator } = require('../../validator/validator')
const { HttpException, NotFound } = require('../../../core/http-exception')
const { Art } = require('./../../models/art')
const { Auth } = require('./../../../middlewares/auth')
const { Favor } = require('./../../models/favor')
/* 获取最新一期的期刊信息 */
router.get('/latest',new Auth().m, async (ctx, next) => {
    /* 权限  角色设置  普通用户8  管理员16  分级 scope */
    // 按 index 排序 查询最大  正序 倒序
    const flow = await Flow.findOne({
        order:[
            ['index','DESC']
        ]
    })
    const art = await Art.getData(flow.art_id,flow.type)
    const likeLatest = await Favor.userLikeIt(flow.art_id,flow.type,ctx.auth.uid)
    // art.dataValues.index = flow.index // 序列化
    art.setDataValue('insex',flow.index)
    /* 添加 like_status 字段*/
    art.setDataValue('like_status',likeLatest)
    ctx.body = art
})

/* 获取下一期期刊信息 */
router.get('/:index/next',new Auth().m, async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {id: 'index'})
    const index = v.get('path.index')
    const art = await Flow.getNextOrPrevous(index+1, ctx.auth.uid)
    ctx.body = art
})

/* 获取上一期期刊信息 */
router.get('/:index/pervous',new Auth().m, async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {id: 'index'})
    const index = v.get('path.index')
    const art = await Flow.getNextOrPrevous(index-1, ctx.auth.uid)
    ctx.body = art
})

/* 获取某一期期刊详细信息 */
router.get('/:type/:id', new Auth().m, async ctx => {
    const v = await new ClassicValidator().validate(ctx)
    const type = parseInt(v.get('path.type'))
    const id = v.get('path.id')

    const artDetail = await new Art(id,type).getDetail(ctx.auth.uid)

    // const art = await Art.getData(id,type)
    // if (!art) {
    //     throw new NotFound()
    // }
    // const like = await Favor.userLikeIt(id,type,ctx.auth.uid)

    artDetail.art.setDataValue('like_status',artDetail.like_status)
    ctx.body = artDetail.art
})

/* 获取某一期期刊点赞信息 */
router.get('/:type/:id/favor', new Auth().m, async ctx => {
    const v = await new ClassicValidator().validate(ctx)
    const type = parseInt(v.get('path.type'))
    const id = v.get('path.id')

    // const art = await Art.getData(id,type)
    // if (!art) {
    //     throw new NotFound()
    // }
    // const like = await Favor.userLikeIt(id,type,ctx.auth.uid)
    const artDetail = await new Art(id,type).getDetail(ctx.auth.uid)

    ctx.body = {
        fav_nums: artDetail.art.fav_nums,
        like_status: artDetail.like_status
    }
})

/* 获取用户喜欢的期刊列表 */
router.get('/favor', new Auth().m, async ctx => {
    const uid = ctx.auth.uid
    const like = await Favor.getMyfavorList(uid)
    ctx.body = like
})

// 面向对象 model class
module.exports = router