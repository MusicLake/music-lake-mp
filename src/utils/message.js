export default {
  warning(msg) {
    wx.showToast({
      title: msg,
      icon: "none"
    });
  }
};
