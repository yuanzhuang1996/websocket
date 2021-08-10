class Ws {
  constructor(param) {
    this.url = param.url
    this.content = param.content //d订阅内容
    this.Heartbeat_s = param.Heartbeat_s || null  //心跳间隔
    this.Heartbeat_time = null //心跳计时器
    this.Heartbeat_status = false //心跳状态
    this.Heartbeat_content = param.Heartbeat_content || ''      //心跳内容
    this.reconnect_s = param.reconnect_s || null     //重连间隔
    this.reconnect_time = null //断开重连计时器
    this.reconnect_status = false
    this.success = param.success  //成功回调
    this.error = param.error      //失败回调
    this.init()
  }
  init() {
    this.ws = new WebSocket(this.url)
    this.ws.onopen = this.open.bind(this)
    this.ws.onmessage = this.message.bind(this)
    this.ws.onerror = this.err.bind(this)
  }
  open() {
    console.log('链接成功')
    this.closeReconnect()  //关闭重新连接
    this.Heartbeat_status = false  //重连成功关闭自动重连
    this.send(this.content)
    this.Heartbeat()
  }
  send(text) {
    this.ws.send(text)
  }
  message(e) {
    this.success(e)
  }
  close(e) {
    this.closeHeartbeat() //关闭心跳
    this.ws.close()
    this.Heartbeat_status = false
    this.Heartbeat_s = null
    this.reconnect_status = false
  }
  err(e) {
    this.error(e)
    // 错误重连
    this.closeHeartbeat() //防止错误之后还执行心跳
    this.Open_reconnect(this.reconnect_s)
  }
  // 手动开启心跳
  Open_heartbeat(s) {
    this.Heartbeat_s = s ? s : 5000
    if (this.ws.readyState == 1) {
      this.Heartbeat_status = true
      this.Heartbeat()
    } else {
      console.log('心跳开启失败,确认是否链接WebSocket,或者调用Open_reconnect方法重新连接')
    }
  }
  // 心跳
  Heartbeat() {
    this.Heartbeat_judgment()
    if (!this.Heartbeat_status && !this.Heartbeat_s) return
    this.closeHeartbeat()
    this.Heartbeat_time = setInterval(() => {
      console.log(this.Heartbeat_content)
      this.send(this.Heartbeat_content)
      this.Heartbeat_status = true
    }, this.Heartbeat_s)
  }
  // 心跳判断 是否初始化时传入心跳
  Heartbeat_judgment() {
    // 为了更灵活还是足个设置吧
    if (this.Heartbeat_s) {
      this.Heartbeat_status = true
    } else {
      this.Heartbeat_status = false
    }
  }
  //关闭心跳
  closeHeartbeat() {
    clearInterval(this.Heartbeat_time)
  }
  // 关闭重新链接
  closeReconnect() {
    clearInterval(this.reconnect_time)
  }
  // 断开重连  重连次数下周在做
  Open_reconnect(time) {
    if (time) this.reconnect_s = time
    // 是否正在重连中
    if (this.Heartbeat_status) return
    // 安全起见先关闭一次
    this.close()
    if (!this.reconnect_s) return
    console.log('正在重连')
    this.init()
    this.reconnect_time = setInterval(() => {
      this.Heartbeat_status = true
      this.init()
    }, this.reconnect_s);
  }
  // 是否传入重连间隔
}

export { Ws }