const bcrypt = require('bcryptjs')
const { sequelize } = require('../../core/db')
/* 模块重命名
    import 引入时使用 as 

    引入npm 包时使用
    require 引入时使用 ：导出时也可以更改模块名
    引入自己定义的模块时 可以使用模块导出时更改模块名
    module.exports = {
        db(导入时使用):secquelize
    }
*/
const { Sequelize , Model } = require('sequelize')
const { NotFound, AuthFailed } = require('./../../core/http-exception')

class User extends Model {
    static async verifyEmailPassword (email, plainPassword) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (!user) {
            throw new AuthFailed('账号不存在')
        }

        const correct = bcrypt.compareSync(plainPassword,user.password)
        if (!correct) {
            throw new AuthFailed('密码错误，请重新输入！')
        }
        return User
    }

    static async getUserByOpenid (openid) {
        const user = await User.findOne({
            where: {
                openid
            }
        })
        return user

    }

    static async registerByOpenid (openid) {
        return await User.create({
            openid
        })
    }
}

User.init({
    // 主键 关系型数据库  
    // 主键字段区别  唯一性 不为空
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,  //主键
        autoIncrement: true, //z自增长
    },
    nickname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING(128),
        unique: true
    },
    password: {
        // 扩展 设计模式 观察者模式
        type: Sequelize.STRING,
        // ES6 reflect Vue3.0
        set(val) {
            const salt = bcrypt.genSaltSync(10)
            const psw = bcrypt.hashSync(val,salt)
            this.setDataValue('password',psw)  //接收两个参数 key,value
        }
    },
    openid: {
        type: Sequelize.STRING(64),
        unique: true  //是否唯一
    },
    
},{
    sequelize,
    tableName: 'user'
})

module.exports = { User }
// 数据迁移  SQL  更新 风险