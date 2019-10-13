const Router = require('koa-router')  //引入koa router
const { TokenValidator,NotEmptyValidator } =  require('./../../validator/validator')
const { LoginType } = require('./../../lib/enum')
const { User } = require('./../../models/user')
const { ParameterException } = require('./../../../core/http-exception')

const { generateToken } = require('./../../../core/util')
const { Auth } = require('./../../../middlewares/auth')
const { WXManager } = require('./../../services/wx')
const router = new Router({
    prefix: '/v1/token'
})
/* 获取token 有用户名密码所以为了安全用post */
router.post('/', async (ctx) => {
    const v = await new TokenValidator().validate(ctx)
    // type  业务逻辑
    // 1.在API接口中编写（一般不）
    // 2.Model 分层

    // MVC 业务Model
    // 业务分层  简单的写在model层 ，Service层（复杂业务）
    // 层级越多 维护成本也高 所以分层要合理
    let token;
    switch (v.get('body.type')){
        case LoginType.USER_EMAIL:
                token = await emailLogin(v.get('body.account'),v.get('body.secret'))
            break;
        case LoginType.USER_MINI_PROGRAM:
                token = await WXManager.codeToToken(v.get('body.account'))
            break;
        case LoginType.ADMIN_EMAIL:
            break
        default:
            throw new ParameterException('没有相应的处理函数！')
    }
    ctx.body = { token }
})
/* 验证token是否有效接口 */
router.post('/verify', async (ctx) => {
    // 接收token
    const v = await new NotEmptyValidator().validate(ctx)

    const result = Auth.verifyToken(v.get('body.token'))
    ctx.body = {
        is_valid:result
    }
})

async function emailLogin(account, secret) {
    const user = await User.verifyEmailPassword(account, secret)
    return token =  generateToken(user.id, Auth.USER)
}

module.exports = router