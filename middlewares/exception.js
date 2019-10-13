
const { HttpException } = require('../core/http-exception')
const catchError = async (ctx, next) => {
    try {
        await next ()
    } catch (error) {
        // 简化error
        // 开发环境 生产环境
        const isHttpException = error instanceof HttpException

        const isDev = global.config.environment === 'dev'

        if (isDev && !isHttpException) {
            throw error
        }
        // console.log(error instanceof HttpException)
        if(isHttpException) {
            ctx.body = {
                msg:error.msg,   //错误信息
                error_code:error.errorCode,  //错误码（开发者定义）
                request:`${ctx.method} ${ctx.path}`  //当前请求的url
            }
            ctx.status = error.code
        } else {
            // 未知错误
            ctx.body = {
                msg: '意外错误！',
                error_code: 999,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = 500
        }
    }
}

module.exports =  catchError