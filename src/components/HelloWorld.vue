import { ws } from '../../utils/websocket';
<template>
  <div class="hello">
    <button @click="Change">更改订阅内容</button>
    <button @click="colse">点击断开链接</button>
    <button @click="Heartbeat">开启心跳</button>
    <button @click="colseHeartbeat">关闭心跳</button>
    <button @click="reset">开启/重新连接</button>
    <button @click="colseReset">关闭重新连接</button>
      <input type="text" v-model="value">
      <button @click="btn">发送</button>
    <!-- 5654 -->
  </div>
</template>



<script>
import { Ws } from "../../utils/websocket";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      ws: null,
      value:''
    };
  },
  methods: {
    Change() {
      this.ws.send("更改订阅"); //将消息发送到服务端
    },
    colse() {
      this.ws.close();
    },
    Heartbeat() {
      this.ws.Open_heartbeat(2000);
    },
    colseHeartbeat() {
      this.ws.closeHeartbeat();
    },
    reset() {
      this.ws.Open_reconnect(2000);
    },
    colseReset() {
      this.ws.closeReconnect();
    },
    btn() {
        this.ws.send(JSON.stringify({name:window.location.href,value:+this.value})); //将消息发送到服务端
    },
    init() {
      this.ws = new Ws({
        url: "ws://172.29.16.1:8888",
        content: "发送数据",
        Heartbeat_content: "心跳",//心跳内容
        // reconnect_s: 10000, //重新连接间隔   不传默认不适用心跳
        // Heartbeat_s: 10000, //心跳间隔    不传默认不重连
        success: function (e) {
          console.log(e)
        },
        error: function (e) {
          console.log(e); //错误失败回调
        },
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
