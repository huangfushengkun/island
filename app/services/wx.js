/* 微信登录 业务分层 Service层 */
const util = require('util')
const { AuthFailed } = require('./../..//core/http-exception')
const axios = require('axios')
const { User } = require('./../models/user')
const { generateToken } = require('./../../core/util')
const { Auth } = require('./../../middlewares/auth')
class WXManager {
    static async codeToToken (code) {
        // console.log(code)
        /* 格式化URL  模板 按占位顺序填入对应参数 */
        const url = util.format(global.config.wx.loginUrl,global.config.wx.appId,global.config.wx.appSecret,code)
        // 获取openid
        const result = await axios.get(url)
        // console.log(url)
        if(result.status !== 200){
            throw new AuthFailed('openid获取失败')
        }
        // console.log(result.data)
        const errcode = result.data.errcode
        const errormsg = result.data.errmsg
        if ( errcode ) {
            throw new AuthFailed('openid获取失败'+ errormsg)
        }
        // 获取到openId（不要泄露） 后写入数据库user表格
        /* 
            1.用户登录时会得到 code  => API 发向云端鉴权 => 得到openId 判断数据库中是否已经存在此openId => 如果没有  将openId写入数据库  => 
            生成tooken 返回给用户
        */
        // 1.先查询此 openid是否 已经存在了
        let user = await User.getUserByOpenid(result.data.openid)
        // console.log(user)
        if (!user) {
            user = await User.registerByOpenid(result.data.openid)
        }
        return generateToken(user.id,Auth.USER_MINI)
    }
}

module.exports = {
    WXManager
}