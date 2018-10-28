import Vue from 'vue'
import Fly from "flyio/dist/npm/wx";

const fly = new Fly;

fly.config.baseURL = "https://player.zzsun.cc";
fly.config.timeout = 5000;
fly.config.headers = {
  "Content-Type": "application/x-www-form-urlencoded"
};
fly.interceptors.request.use(function(config) {
  const token = wx.getStorageSync("token");
  if (token) {
    config.headers.accesstoken = token;
  }
  return config;
}, function(error) {
  return Promise.reject(error);
});
fly.interceptors.response.use(
  response => response.data,
  e => {
    console.warn(e);
    if (e.response) {
      const data = e.response.data;
      if (e.response.status === 401) {
        wx.getStorageSync("token");
        wx.removeStorageSync("token");
        // Vue.$store.dispatch("user/logout", false);
      } else if (e.response.status === 502) {
        Vue.$message.warning("服务端可能正在发版本~请稍后重试");
      } else if (data.msg) {
        Vue.$message.warning(data.msg);
      }
    } else {
      Vue.$message.warning("请检查网络连接");
    }
    return Promise.reject(e);
  }
);

export default fly;
