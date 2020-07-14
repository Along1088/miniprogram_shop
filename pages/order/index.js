// pages/order/index.js
import { request } from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /* tab栏数据 */
    tabs: [
      {
        value: '全部',
        index: 0,
        isActive: true,
      },
      {
        value: '待付款',
        index: 1,
        isActive: false,
      },
      {
        value: '待收货',
        index: 2,
        isActive: false,
      },
      {
        value: '退款/退货',
        index: 3,
        isActive: false,
      },
    ],
    /* 订单数组 */
    orders: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  onShow: function () {
    /* 判断缓存中token是否有值 */
    const token = wx.getStorageSync('token')
    /* 没有值则跳转到授权页面 */
    if (!token) {
      wx.navigateTo({ url: '../auth/index' })
      return
    }
    /* onShow无法拿到页面参数，必须通过得到页面栈数组中的当前页面，当前页面的option中才有值 */
    let pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const { type } = currentPage.options
    /* 根据type值决定order页面tab栏的高亮效果 */
    this.changeTitleByIndex(type - 1)
    this.getOrders(type)
  },
  /* 封装的根据传过来的参数决定哪个tab高亮 */
  changeTitleByIndex(index) {
    let { tabs } = this.data
    tabs.forEach((v) =>
      v.index === index ? (v.isActive = true) : (v.isActive = false)
    )
    this.setData({ tabs })
  },
  /* 获取订单数据 */
  async getOrders(type) {
    let { orders } = await request({ url: '/my/orders/all', data: { type } })
    orders = orders.map((v) => ({
      ...v,
      create_time_cn: new Date(v.create_time * 1000).toLocaleString(),
    }))
    this.setData({ orders })
  },
  /* tab栏切换 */
  handleItemChange(e) {
    const { index } = e.detail
    this.changeTitleByIndex(index)
    this.getOrders(index + 1)
  },
})
