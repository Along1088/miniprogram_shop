// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /* 用户信息 */
    userInfo: {},
    /* 被收藏的商品数量 */
    collectNumbers: 0,
  },
  onShow() {
    const userInfo = wx.getStorageSync('userinfo')
    const collect = wx.getStorageSync('collect')
    this.setData({ userInfo, collectNumbers: collect.length })
  },
})
