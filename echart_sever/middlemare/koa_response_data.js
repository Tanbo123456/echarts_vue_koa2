const path = require('path')
const getFileDataUtil = require('../utils/util_Get_File_data')
module.exports = async(ctx,next)=>{
    // 获取数据,数据index由前端url提供
    const url = ctx.request.url // /api/xxx ----->/data/xxx
    let pathname = '../data'+url.replace('/api','')+'.json'
    
    // 拼接url绝对地址，获取data下json数据
    pathname = path.join(__dirname,pathname)
    console.log(pathname);
    try {
        const data = await getFileDataUtil(pathname)
        ctx.response.body = data
    } catch (error) {
        const errMsg = JSON.stringify({status:1,msg:'获取数据失败'})
        ctx.response.body=errMsg
    }
    
    await next()
}