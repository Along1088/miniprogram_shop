// pages/goods_list/index.js
import { request } from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true,
      },
      {
        id: 1,
        value: '销量',
        isActive: false,
      },
      {
        id: 2,
        value: '价格',
        isActive: false,
      },
    ],
    /* 返回的商品数据 */
    goodsList: [],
  },
  paramsInfo: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10,
  },
  total: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.paramsInfo.cid = options.cid || ''
    this.paramsInfo.query = options.query || ''
    this.getGoodsList()
  },
  /* 上方tab栏切换效果的实现 */
  handleItemChange(e) {
    //1。获取被点击的索引
    const { index } = e.detail
    //2。修改源数组
    let { tabs } = this.data
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    )
    //3。赋值到data中
    this.setData({ tabs })
  },
  //获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.paramsInfo })
    this.total = res.total
    this.setData({ goodsList: [...this.data.goodsList, ...res.goods] })
    //关闭下拉刷新窗口
    wx.stopPullDownRefresh()
  },
  /* 上拉加载更多 */
  onReachBottom() {
    // console.log('触底了')
    if (this.total > this.paramsInfo.pagenum * this.paramsInfo.pagesize) {
      //总数大于当前的页码乘以当前每页显示的数量则发起下一页请求
      this.paramsInfo.pagenum++
      this.getGoodsList()
    } else {
      wx.showToast({
        title: '没有数据啦^_^',
      })
    }
  },
  /* 下拉重新加载数据 */
  onPullDownRefresh() {
    this.setData({ goodsList: [] })
    this.paramsInfo.pagenum = 1
    this.getGoodsList()
  },
})
