const Router = require('koa-router')  //引入koa router
const { Success } = require('./../../../core/http-exception')
const { RegisteerValidator } = require('./../../validator/validator')
const { User } = require('../../models/user')
const router = new Router({
    prefix: '/v1/user'  //添加路由前缀
})

//  注册 新增数据 post get delete  put 

router.post('/register', async (ctx) => {
    // 思维路线
    // 接收参数  Linvalidator 参数校验
    //参数： email password passw1 nickname
    const v = await new RegisteerValidator().validate(ctx)  //必须在第一行 
    // 数据存入数据库
    // email password  tooken 无意义的随机字符串  jwt 携带数据
    const user = {
        email: v.get('body.email'),
        password: v.get('body.password2'),  //加密密码
        nickname: v.get('body.nickname')
    }
    await User.create(user)
    throw new Success()  //请求成功
})

module.exports = router
