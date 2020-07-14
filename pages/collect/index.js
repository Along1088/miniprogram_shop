// pages/collect/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    tabs: [
      {
        index: 0,
        value: '商品收藏',
        isActive: true,
      },
      {
        index: 1,
        value: '品牌收藏',
        isActive: false,
      },
      {
        index: 2,
        value: '店铺收藏',
        isActive: false,
      },
      {
        index: 3,
        value: '浏览足迹',
        isActive: false,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const collect = wx.getStorageSync('collect') || []
    this.setData({
      collect,
    })
  },
  handleItemChange(e) {
    /* 这是点击的item对应的index */
    const { index } = e.detail
    /* 把点击对应的item设置为true 其他为false */
    let { tabs } = this.data
    tabs.forEach((v) =>
      v.index === index ? (v.isActive = true) : (v.isActive = false)
    )
    this.setData({ tabs })
  },
})
