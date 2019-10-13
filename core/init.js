
const requireDirectory = require('require-directory')
const Router = require('koa-router')  //引入koa router

class InitManager {

    static initCore(app) {
        // 入口方法
        InitManager.app = app //参数保存
        InitManager.initLoadRouters()
        InitManager.loadConfig()
    }
    static loadConfig(path = '') {
        const configPath = path || process.cwd() + '/config/config.js'
        const config = require(configPath)
        global.config = config
    }
    // 初始化路由
    static initLoadRouters () {
            // process.cwd() 获取当前项目的绝对路径
        const apiDirectory = `${process.cwd()}/app/api`
        requireDirectory(module, apiDirectory, {
            visit: whenLoadModule  //自定义函数（回调函数）
        })

        function whenLoadModule(obj) {
            if (obj instanceof Router ) {  //判断obj的合法性
                InitManager.app.use(obj.routes())
            }
        }
    }
}

module.exports = InitManager