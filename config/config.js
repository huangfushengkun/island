module.exports = {
    environment: 'dev',
    database: {
        dbName: '7yue', //数据库名称
        host: 'localhost',  //数据库的IP
        port: 3306, 
        user: 'root',
        password: '7521huangfu'
    },
    security: {
        secretKey: "huangfushengkun",
        expiresIn: 60*60*24*30
    },
    wx: {
        appId: 'wxb0c6e76834dffc68',  //自己小程序的appId
        appSecret: 'a27e96c0651170c131b886b115e55af2', //同上
        /* 获取openId的模板URL 注意占位符%s */
        loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    },
    yushu: {
        detailUrl: 'http://t.yushu.im/v2/book/id/%s',
        keywordUrl: 'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s'
    }
}