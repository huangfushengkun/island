
const {
    Movie,
    Sentence,
    Music
} = require('../models/classic')
const { Op } = require('sequelize')

const { flatten } = require('lodash')
class Art {
    static async getList (artInfoList) {
        // 3中类型 art
        // 3次 in查询
        const artInfoObj = {
            100: [],
            200: [],
            300: []
        }
        for(let artInfo of artInfoList){
            artInfoObj[artInfo.type].push(artInfo.art_id)
        }
        const arts = []
        for (let key in artInfoObj) {
            const ids = artInfoObj[key]
            if (ids.length === 0) {
                continue  //跳出本次循环 继续下一次循环
            }
            key = parseInt(key)
            arts.push(await Art._getListByType(ids, key))
        }
        return flatten(arts)  //展开二维数组
    }

    static async _getListByType (ids, type) {
        let arts = null
        const finder = {
            where:{
                id:{
                    [Op.in]:ids
                }
            }
        }
        const scope =  'bh'
        switch (type) {
            case 100:
                arts = await Movie.scope(scope).findOne(finder)
                break
            case 200:
                arts = await Music.scope(scope).findOne(finder)
                break
            case 300:
                arts = await Sentence.scope(scope).findOne(finder)
                break
            case 400:
                break
            default:
                break
        }
        return arts
    }


    static async getData (art_id, type, useScope=true) {
        let art = null
        const finder = {
            where:{
                id:art_id
            }
        }
        const scope = useScope ? 'bh' : null
        switch (type) {
            case 100:
                art = await Movie.scope(scope).findOne(finder)
                break
            case 200:
                art = await Music.scope(scope).findOne(finder)
                break
            case 300:
                art = await Sentence.scope(scope).findOne(finder)
                break
            case 400:

                break
            default:
                break
        }
        return art
    }
}

module.exports = {
    Art
}