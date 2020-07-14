// pages/goods_detail/index.js
import { request } from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},
    /* 默认商品没有被收藏 */
    isCollect: false,
  },
  //商品对象
  goodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    //options是上个页面传递过来的页面参数对象
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    this.getGoodsDetail(currentPage.options)
  },
  async getGoodsDetail(data) {
    const res = await request({ url: '/goods/detail', data })
    this.goodsInfo = res
    /* 1.获取缓存中收藏数组 */
    let collect = wx.getStorageSync('collect') || []
    /* 2.判断当前商品是否被收藏了 */
    let isCollect = collect.some((v) => v.goods_id === this.goodsInfo.goods_id)
    this.setData({
      goodsDetail: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        pics: res.pics,
        /* iphone部分手机不支持webp图片格式 把webp替换成jpg */
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
      },
      isCollect,
    })
  },
  //点击轮播图放大预览
  handlePreview(e) {
    const current = e.currentTarget.dataset.url
    const urls = this.goodsInfo.pics.map((v) => v.pics_big)
    wx.previewImage({
      current,
      urls,
    })
  },
  //加入购物车
  addToCart() {
    //1、获取本地的cart购物车数组，|| 表示如果不存在则赋值为空数组
    let cart = wx.getStorageSync('cart') || []
    //2、判断当前添加的物品是否已经存在于购物车存在增加数量
    let index = cart.findIndex((v) => v.goods_id === this.goodsInfo.goods_id)
    if (index === -1) {
      //3.不存在第一次添加
      this.goodsInfo.num = 1
      this.goodsInfo.checked = true
      cart.push(this.goodsInfo)
    } else {
      //4.已经存在当前这个商品num++
      cart[index].num++
    }
    //5.无论之前是否存在都需要重新将cart添加到缓存中
    wx.setStorageSync('cart', cart)
    //6.提示加入成功
    wx.showToast({
      title: '加入成功！',
      icon: 'success',
      //防抖控制1.5秒后用户才能操作
      mask: true,
    })
  },
  handleCollect() {
    let { isCollect } = this.data
    /* 从缓存拿到收藏数组 可能为空 */
    let collect = wx.getStorageSync('collect') || []
    /* 已经收藏了 则取消收藏：遍历缓存的收藏数组，删除这个id对应的item项 */
    if (isCollect) {
      collect = collect.filter((v) => v.goods_id !== this.goodsInfo.goods_id)
      wx.showToast({
        title: '取消成功',
        mask: true,
      })
    } else {
      /* 未收藏 则在缓存的收藏数组中添加这个id的item项 */
      collect.push(this.goodsInfo)
      wx.showToast({
        title: '收藏成功',
        mask: true,
      })
    }
    /* 无论是否收藏 都需要设置缓存 */
    wx.setStorageSync('collect', collect)
    /* 无论状态是否收藏 都直接取反 */
    this.setData({ isCollect: !isCollect })
  },
  handleBuy() {
    console.log('购买了')
  },
})
