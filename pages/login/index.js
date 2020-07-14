// pages/login/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  handleLogin(e) {
    wx.setStorageSync("userinfo",e.detail.userInfo)
    wx.navigateBack({ delta: 1 })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
})
