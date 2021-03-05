// 创建单例模式的socket对象
export default class Socket{
    static instance = null
    static get Instance (){ //静态方法里的this为类本身
        if (!this.instance) {
            this.instance = new Socket()
        }
        return this.instance
    }
    
    // 业务与回调函数之间的映射容器
    callBackMapping = {}

    // 注册回调函数
    registerCallBack(socketType,callBack){
        this.callBackMapping[socketType] = callBack
    }
    // 注销回调函数
    unRegisterCallBack(socketType){
        this.callBackMapping[socketType]=null
    }
    ws = null // 实例属性，websocket对象
    connect(){
        if (!window.WebSocket) {
            return console.log("浏览器不支持 WebSocket");
        }
        this.ws = new WebSocket('ws://localhost:9000')

        // 监听连接
        this.ws.onopen=()=>{
            console.log('连接服务器成功');
        }
        // 监听message
        // 监听关闭连接
        this.ws.onclose=(e)=>{
            console.log('连接服务器失败');
        }
        this.ws.onmessage=(msg)=>{
            console.log('ws 接受数据');
        }
    }

    // 发送数据到服务器
    send(data){
        this.ws.send(JSON.stringify(data))
    }
}