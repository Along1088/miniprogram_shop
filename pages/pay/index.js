// pages/cart/index.js
import { request } from '../../request/index'
import { requestPayment, showToast } from '../../utils/asyncWx'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },
  onShow: function () {
    const address = wx.getStorageSync('address')
    let cart = wx.getStorageSync('cart') || []
    cart = cart.filter((v) => v.checked)
    /* 计算全选 */
    /* const allChecked = cart.length ? cart.every((v) => v.checked) : false */
    /* 循环cart数组 计算总价格 totalPrice += 数量*价格 总数量 totalNum += 数量 */
    let totalPrice = 0
    let totalNum = 0
    cart.forEach((v) => {
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    })
    /* 计算完成设置回data */
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address,
    })
  },
  /* 点击支付 */
  async handleOrderPay() {
    try {
      /* 判断缓存中是否有token值 */
      const token = wx.getStorageSync('token')
      if (!token) {
        /* 跳转到授权页面获取token */
        wx.navigateTo({
          url: '../auth/index',
        })
      } else {
        /* 有token 创建订单 */
        /* 准备请求头参数 */
        // const header = { Authorization: token }
        /* 准备请求体参数 */
        const order_price = this.data.totalPrice
        const consignee_addr = this.data.address.all
        const { cart } = this.data
        const goods = cart.map((v) => {
          return {
            goods_id: v.goods_id,
            goods_number: v.num,
            goods_price: v.goods_price,
          }
        })
        const data = { order_price, consignee_addr, goods }
        /* 准备发送请求 得到订单号*/
        const { order_number } = await request({
          url: '/my/orders/create',
          method: 'POST',
          data,
        })
        console.log(order_number)
        /* 发起预支付请求 得到微信支付api所需参数 */
        const { pay } = await request({
          url: '/my/orders/req_unifiedorder',
          method: 'POST',
          data: { order_number },
        })
        console.log(pay)
        /* 调用微信的支付api */
        await requestPayment(pay)
        // 查看后台订单状态
        const res = await request({
          url: '/my/orders/chkOrder',
          methode: 'POST',
          data: { order_number },
        })
        await showToast('支付成功')
        /* 从缓存中删除已选中支付的商品 */
        let newCart = wx.getStorageSync('cart')
        newCart = newCart.filter((v) => !v.checked)
        wx.setStorageSync('cart', newCart)
        /* 跳转到订单页面 */
        wx.navigateTo({
          url: '../order/index',
        })
      }
    } catch (err) {
      console.log(err)
      await showToast('支付失败')
    }
  },
})
