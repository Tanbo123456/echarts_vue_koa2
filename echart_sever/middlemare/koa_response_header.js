module.exports=async (ctx,next)=>{
    const contentType = 'application/json;charset=utf-8'
    ctx.set('Content-Type',contentType)
    // 设置cors，允许跨域
    ctx.set('Access-Control-Allow-Origin','*') // Access-Control-Allow-Origin
    ctx.set('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE') // Access-Control-Allow-Methods
    await next()
}