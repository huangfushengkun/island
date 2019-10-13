
const basicAuth = require('basic-auth')
const { Forbbiden } = require('./../core/http-exception')
const jwt = require('jsonwebtoken')

class Auth {
    constructor (level) {
        this.level = level || 1  //API权限
        Auth.USER = 8
        Auth.ADMIN = 16
        Auth.SUPER_ADMIN = 32
    }
    get m() {
        return async (ctx, next) => {
            // 检测tooken  传递令牌   body ，header 约定传递方式
            const userToken = basicAuth(ctx.req)
            let errMag = 'token不合法'
            if (!userToken || !userToken.name) {
                throw new Forbbiden(errMag)
            }
            try {
                var decode = jwt.verify(userToken.name,global.config.security.secretKey)
            } catch (error) {
                //1. 不合法
                //2. 过期
                if(error.name == 'TokenExpiredError') {
                    errMag = 'token已失效'
                } 
                throw new Forbbiden(errMag)
            }

            if (decode.scope < this.level) {
                errMag = '权限不足'
                throw new Forbbiden(errMag)
            }
            ctx.auth = {
                uid:decode.uid,
                scope:decode.scope
            }

            await next()
        }
    }

    static verifyToken(token){
        try {
            jwt.verify(token,global.config.security.secretKey)
            return true
        } catch(error){
            return false
        }
    }
}

module.exports = { Auth }