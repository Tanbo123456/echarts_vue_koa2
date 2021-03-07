// websocket模块
const ws = require('ws')
const path = require('path')
const getFileDataUtil = require('../utils/util_Get_File_data')

// 接口数据

// 1. 获取图表数据
// {
//     "action": "getData",
//       "socketType": "trendData","mapData","sellerData","rankData","hotData","stockData"
//       "chartName": "trend",同上
//       "value": ""
//  }
// 2. 全屏联动
// {
//     "action":  "fullScreen",
//       "socketType": "fullScreen",
//       "chartName": "trend",
//       "value": true
//  }
// 3. 主题颜色修改联动
// {
//     "action":"themeChange"
//       "socketType": "themeChange",
//       "chartName": "",
//       "value": "chalk",""
//  }
// 4. 返回浏览器数据
// 除了action为getData时，服务器返回的数据是在原基础上增加data之外，其余类型都原样返回

// 创建websocket实例对象
const wss = new ws.Server({
    port:9000
})

module.exports.listen = function(){
    wss.on("connection",socket=>{
        console.log('有客户端连接');
        socket.on("message",async msg=>{
            console.log('客户端发送数据了');
            let requestData = JSON.parse(msg)
            let A={name:'yipo'}
            // console.log(requestData);
            if (requestData.action==="getData") {
                // console.log("getData");
                let filePath = '../data/'+requestData.chartName+'.json'
                filePath = path.join(__dirname,filePath)
                const fileData = await getFileDataUtil(filePath) //json格式的
                requestData.data = fileData
                socket.send(JSON.stringify(requestData))
            } else {
                wss.clients.forEach(socket=>{
                    console.log("****");
                    socket.send(msg)
                })
            }
        })
    })
}