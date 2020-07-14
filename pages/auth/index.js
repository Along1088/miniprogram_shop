// pages/auth/index.js
import { login } from '../../utils/asyncWx.js'
import { request } from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  async handleGetUserInfo(e) {
    try {
      /* 没有企业账号 此接口返回的token值为null 所以自己随便写一个token */
      // /* 1。获取用户信息 */
      // const { encryptedData, rawData, iv, signature } = e.detail
      // console.log(e.detail)

      // /* 2。获取小程序登陆后的code */
      // let { code } = await login()
      // let { token } = await request({
      //   url: '/users/wxlogin',
      //   method: 'POST',
      //   data: { encryptedData, rawData, iv, signature, code },
      // })
      wx.setStorageSync(
        'token',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
      )
      wx.navigateBack({ delta: 1 })
    } catch (err) {
      console.log(err)
    }
  },
})
