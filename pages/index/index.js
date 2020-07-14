// 引入发送请求的方法
import { request } from '../../request/index.js'
Page({
  data: {
    /* 轮播图数组 */
    swiperList: [],
    cateList: [],
    floorList: [],
  },
  onLoad: function () {
    /* wx.request({
      url: '/home/catitems',
      success: (res) => {
        this.setData({
          swiperList: res.data.message,
        })
      },
    }) */
    this.getSwiperlist()
    this.getCateList()
    this.getFloorList()
  },
  //获取轮播图数据
  async getSwiperlist() {
    const res = await request({
      url: '/home/swiperdata',
    })
    console.log(res)

    res.forEach((v) => {
      v.navigator_url = v.navigator_url.replace(/main/, 'index')
    })

    this.setData({
      swiperList: res,
    })
  },
  //获取分类导航数据
  async getCateList() {
    const res = await request({
      url: '/home/catitems',
    })
    this.setData({ cateList: res })
  },
  //获取楼层数据
  async getFloorList() {
    const res = await request({
      url: '/home/floordata',
    })
    res.forEach((v) => {
      v.product_list.forEach((v1) => {
        v1.navigator_url = v1.navigator_url.replace(
          /goods_list/,
          'goods_list/index'
        )
      })
    })
    this.setData({ floorList: res })
  },
})
