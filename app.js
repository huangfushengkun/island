
require('module-alias/register')
const Koa = require('koa')  //引入
const parser = require('koa-bodyparser')
const path =require('path')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')
const static = require('koa-static')


const app = new Koa() //实例化
//接受HTTP请求 => 中间件（函数）
app.use(catchError)
app.use(parser())
app.use(static(path.join(__dirname,'./static')))

InitManager.initCore(app)

app.listen(3000)