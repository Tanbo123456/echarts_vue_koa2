// 创建单例模式的socket对象
export default class Socket {
    static instance = null
    static get Instance() { //静态方法里的this为类本身
        if (!this.instance) {
            this.instance = new Socket()
        }
        return this.instance
    }


    // 记录连接状态
    connected = false
    sendRetryCount = 0

    // 连接次数
    connectRetryCount=0
    // 业务与回调函数之间的映射容器
    callBackMapping = {}

    // 注册回调函数
    registerCallBack(socketType, callBack) {
        this.callBackMapping[socketType] = callBack
    }
    // 注销回调函数
    unRegisterCallBack(socketType) {
        this.callBackMapping[socketType] = null
    }
    ws = null // 实例属性，websocket对象
    connect() {
        if (!window.WebSocket) {
            return console.log("浏览器不支持 WebSocket");
        }
        this.ws = new WebSocket('ws://localhost:9000')

        // 监听连接
        this.ws.onopen = () => {
            console.log('连接服务器成功');
            this.connectRetryCount=0
            this.connected=true
        }
        // 监听message
        // 监听关闭连接或者初始化连接不成功
        this.ws.onclose = (e) => {
            console.log('连接服务器失败');
            this.connected = false
            setTimeout(()=>{
                this.connectRetryCount++
                this.connect()
            },this.connectRetryCount*500)
        }
        this.ws.onmessage = (msg) => {
            console.log('ws 接受数据');
            // 获取数据
            // 根据数据的socketType判断是否有回调函数，有的话执行回调函数
            const receiveData = JSON.parse(msg.data)
            const socketType = receiveData.socketType
            if (receiveData.action==='getData') {
                const realData = receiveData.data
                this.callBackMapping[socketType].call(this,JSON.parse(realData))
            } else if (receiveData.action==='fullScreen') {
                this.callBackMapping[socketType].call(this,receiveData)
            } else {
                console.log('....');
            }
        }
    }

    // 接口数据

    // 1. 获取图表数据 registerCallBack  unRegisterCallBack
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
    // 发送数据到服务器
    send(data) {
        if (this.connected) { //
            // 需要在连接状态下，进行发送数据，否则报错
            this.sendRetryCount=0
            this.ws.send(JSON.stringify(data))
        }else{
            // 连接不成功，则等待连接后在发送
            this.sendRetryCount++
            setTimeout(()=>{
                this.send(data)
            },this.sendRetryCount*500)
        }
        
    }
}