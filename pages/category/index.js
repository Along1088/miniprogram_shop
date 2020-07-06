import { request } from '../../request/index.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //左边的分类导航数据
    leftCates: [],
    //右边的分类导航数据
    rightCates: [],
    //当前激活的菜单项
    currentIndex: 0,
    //滚动至最上方
    scrollTop: 0,
  },
  //所有的分类数据
  cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const localCates = wx.getStorageSync('cates')
    if (!localCates) {
      //没有本地缓存的数据
      this.getCategory()
    } else {
      if (Date.now() - localCates.time > 1000 * 10) {
        //本地存储有数据但是过期了，需要重新获取
        this.getCategory()
      } else {
        //本地有数据且没有过期则直接使用本地数据
        this.cates = localCates.data
        let leftCates = this.cates.map((item) => item.cat_name)
        let rightCates = this.cates[0].children
        this.setData({ leftCates, rightCates })
      }
    }
  },
  async getCategory() {
    const res = await request({
      url: '/categories',
    })
    this.cates = res
    /* 把请求得到的数据存储到本地 */
    wx.setStorageSync('cates', { time: Date.now(), data: this.cates })
    let leftCates = this.cates.map((item) => item.cat_name)
    let rightCates = this.cates[0].children
    this.setData({ leftCates, rightCates })
  },
  /* 监听分类菜单点击事件 */
  handleMenuTap(e) {
    /* 1.首先获取点击的index
    2.给data中的currentIndex赋值
    3.根据当前的index来渲染右侧的商品内容 */
    const { index } = e.currentTarget.dataset
    let rightCates = this.cates[index].children
    this.setData({ currentIndex: index, rightCates, scrollTop: 0 })
  },
})
