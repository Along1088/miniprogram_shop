// pages/search/index.js
import { request } from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    /* 取消按钮的显示隐藏 */
    isShow: false,
    /* 输入框的值 */
    inputValue: '',
  },
  Time: 0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /* 监听输入框的改变 */
  handleInput(e) {
    /* 1.拿到输入的值 */
    let { value } = e.detail
    /* 2.判断输入合法性 */
    if (!value.trim()) {
      /* 不合法  则重置data中的数组 并且隐藏取消按钮*/
      this.setData({ goodsList: [], isShow: true })
      return
    }
    /* 通过合法性验证则说明输入框有值，显示取消按钮 */
    this.setData({ isShow: true })
    /* 3.发送请求 */
    /* 问题：每输入一个字符，都会触发函数并发送一次请求 导致发送的请求过多
    解决方法 防抖 利用定时器回调解决
    */
    /* 发起请求之前先清除之前的定时器 */
    clearTimeout(this.Time)
    this.Time = setTimeout(() => this.getGoodsList(value), 1000)
  },
  async getGoodsList(query) {
    const goodsList = await request({ url: '/goods/qsearch', data: { query } })
    this.setData({ goodsList })
  },
  /* 取消按钮的点击事件 */
  handleCancel() {
    this.setData({ inputValue: '', goodsList: [], isShow: false })
  },
})
