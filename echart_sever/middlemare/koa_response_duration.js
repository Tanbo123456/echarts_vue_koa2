module.exports=async function(ctx,next){
    let start = Date.now()
    ctx.response.body='哈哈'
    await next()
    let end = Date.now()
    ctx.set("X-Response-Time",(end-start)+'ms')
}