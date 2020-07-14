// pages/cart/index.js
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
} from '../../utils/asyncWx.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },
  onShow: function () {
    const address = wx.getStorageSync('address')
    const cart = wx.getStorageSync('cart') || []
    /* 计算全选 */
    /* const allChecked = cart.length ? cart.every((v) => v.checked) : false */
    /* 循环cart数组 计算总价格 totalPrice += 数量*价格 总数量 totalNum += 数量 */
    this.setData({ address })
    this.setCart(cart)
  },
  /* 获取收货地址 */
  async handleChooseAddress() {
    /* 1、获取用户当前的所有权限状态 */
    // wx.getSetting({
    //   success(result) {
    //     /* 2、得到收货地址的权限状态  */
    //     const scopeAddress = result.authSetting['scope.address']
    //     /* 3、对用户收货地址的权限状态进行判断
    //     如果已经允许 则可以直接选择地址
    //     或者没有设置过则在调用选择地址的接口时会自动弹出授权页面 */
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1)
    //         },
    //       })
    //       /* 4、用户之前拒绝过获取收货地址的权限时，诱导用户调用授权接口*/
    //     } else {
    //       wx.openSetting({
    //         success(result2) {
    //           console.log(result2)
    //           /* 授权完成后，再调用选择收货地址接口 */
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3)
    //             },
    //           })
    //         },
    //       })
    //     }
    //   },
    // })
    try {
      let res1 = await getSetting()
      const scopeAddress = res1.authSetting['scope.address']
      if (scopeAddress === false) {
        await openSetting()
      }
      let address = await chooseAddress()
      //地址数据拼接
      address.all =
        address.provinceName +
        address.cityName +
        address.countyName +
        address.detailInfo
      //将获取的地址存入到缓存
      wx.setStorageSync('address', address)
    } catch (err) {
      console.log(err)
    }
  },
  /* 监听商品的复选框变化 */
  handleCheckedChange(e) {
    /* 1。获取修改的商品的id' */
    const goods_id = e.currentTarget.dataset.id
    /* 2。获取购物车数组 */
    let { cart } = this.data
    /* 3.找到被修改的商品对象 */
    let index = cart.findIndex((v) => v.goods_id === goods_id)
    /* 4.选中状态取反 */
    cart[index].checked = !cart[index].checked
    /* 5 6 把购物车数据重新设置到data中和缓存中 */
    this.setCart(cart)
  },
  /* 监听全选按钮的变化 */
  handleAllChecked() {
    /* 1。全选状态取反 
    2。让cart中各项的选中状态跟随全选按钮的状态
    3。改变了cart状态后直接调用封装好的函数 来计算工具栏的值和全选全不选 */
    let { allChecked, cart } = this.data
    allChecked = !allChecked
    cart.forEach((v) => (v.checked = allChecked))
    this.setCart(cart)
  },
  /* 计算工具栏的状态 商品数量 价格 全选*/
  setCart(cart) {
    /* 7。重新计算总数量 总价格 和全选状态*/
    let totalPrice = 0
    let totalNum = 0
    let allChecked = true
    allChecked = !cart.length ? false : true
    /* 当cart为空数组时 不会执行forEach方法 */
    cart.forEach((v) => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    /* 计算完成设置回data */
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked,
    })
    /* 计算后的值设置回storage */
    wx.setStorageSync('cart', cart)
  },
  /* 监听对商品数量的改变 */
  async handleNumEdit(e) {
    /* 拿到商品的id */
    let { goods_id, operation } = e.currentTarget.dataset
    /* 拿到cart中id对应商品的idenx */
    let { cart } = this.data
    const index = cart.findIndex((v) => v.goods_id === goods_id)
    /* 如果商品数量等于1，此时点击- 表示删除商品 则弹出模态框 */
    if (cart[index].num === 1 && operation === -1) {
      /* 弹出模态框 */
      let res = await showModal('确定要删除此商品？')
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      /* 正常操作数组的num属性增加或者减少 */
      cart[index].num += operation
      /* 把操作后的cart数组 交给封装好的函数处理 更新购物车状态*/
      this.setCart(cart)
    }
  },
  /* 点击结算  
  1.判断地址和是是否有商品
  2.跳转到支付页面*/
  async handlePay() {
    const { address, totalNum } = this.data
    if (!address.userName) {
      await showToast('请选择收货地址')
      return
    }
    if (totalNum === 0) {
      await showToast('购物车为空')
      return
    }
    wx.navigateTo({
      url: '../pay/index',
    })
  },
})
