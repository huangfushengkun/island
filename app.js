
require('module-alias/register')
const Koa = require('koa')  //引入
const parser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')


const app = new Koa() //实例化
//接受HTTP请求 => 中间件（函数）
app.use(catchError)
app.use(parser())

InitManager.initCore(app)

app.listen(3000)