const Koa = require('koa')
// 创建Koa对象
const app = new Koa()

// 连接websocket，监听
const webSocketService = require('./socket_service/websocket_service')
webSocketService.listen()

// 使用响应间隔计算中间件
const KoaResponseDuration = require('./middlemare/koa_response_duration')
app.use((KoaResponseDuration))
// 使用设置响应头中间件
const KoaResponseHeader = require('./middlemare/koa_response_header')
app.use(KoaResponseHeader)

// 使用返回数据的中间件
const KoaResposeData = require('./middlemare/koa_response_data')
app.use(KoaResposeData)

app.listen(8888,()=>{
    console.log('服务器启动成功！http://localhost/8888')
})