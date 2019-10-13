const { 
    LinValidator,
    Rule 
} = require('../../core/lin-validator')

const { User } = require('./../models/user')

const { LoginType } = require('./../lib/enum')
class PositiveIntegerValidator extends LinValidator {

    constructor() {
        super()
        this.id = [
            // && 且关系
            new Rule('isInt', '需要是正整数', {min:1})
        ]
    }
}

/* 注册验证器 */
class RegisteerValidator extends LinValidator {
    constructor () {
        super ()
        this.email = [
            new Rule('isEmail','不符合email规范')
        ]
        this.password1 = [
            // 用户指定范围 
            new Rule('isLength','密码最少6位字符，最多32位字符',{min:6,max:32}),
            new Rule('matches','密码强度太低','^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
        ]
        this.password2 = this.password1
        this.nickname = [
            new Rule('isLength', '昵称不符合长度规范',{
                min:4,
                max:32
            })
        ]
    }
    validatePassword (vals) {
        // post body 的形式传参
        const psw1 = vals.body.password1
        const psw2 = vals.body.password2
        if (psw1 !== psw2 ) {
            throw new Error('两次密码不一致')
        }
    }

    async validateEmail (vals) {
        const email = vals.body.email
        const user = await User.findOne({
            where:{
                email:email
            }
        })
        if (user) {
            throw new Error('email已存在')
        }
    }
}
/* token验证器*/
class TokenValidator extends LinValidator {
    constructor () {
        super ()
        this.account = [
            new Rule('isLength', '不符合账号规则',{
                min: 4, max:32
            })
        ]

        this.secret = [
            // s是必须要传入密码吗？
            // 1.可以为空 可以不传 2. 可以不为空
            new Rule('isOptional'),
            new Rule('isLength', '至少六个字符', {
                min:6,
                max: 128
            })
        ]
    }
    validateLoginType(vals) {
        if (!vals.body.type) {
            throw new Error('type是必传参数')
        }
        if(!LoginType.isThisType(vals.body.type)) {
            throw new Error('type参数不合法')
        }
    }

}
/* 验证token格式 */
class NotEmptyValidator extends LinValidator {
    constructor () {
        super()
        this.token = [
            new Rule('isLength','不允许为空',{min:1})
        ]
    }
}

function checkType(vals) {
    if (!vals.body.type) {
        throw new Error("type是必传参数")
    }
    if (!LoginType.isThisType(vals.body.type)) {
        throw new Error('type参数不合法')
    }
}

/* 验证喜欢接口传递的参数是否合法 */
class LikeValidator extends LinValidator{
    constructor() {
        super()
        this.validateType = checkType
    }
}


module.exports = {
    PositiveIntegerValidator,
    RegisteerValidator,
    TokenValidator,
    NotEmptyValidator,
    LikeValidator
}