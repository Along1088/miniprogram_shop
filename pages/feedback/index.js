// pages/feedback/index.js
import { showToast } from '../../utils/asyncWx'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        index: 0,
        value: '体验问题',
        isActive: true,
      },
      {
        index: 1,
        value: '商品、商家投诉',
        isActive: false,
      },
    ],
    /* 选择图片路径数组 */
    tempFilePaths: [],
    /* 文本框内容 */
    inputValue: '',
  },
  /* 外网的图片的路径数组 */
  UpLoadImgs: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  handleItemChange(e) {
    /* 拿到点击的索引 */
    const { index } = e.detail
    /* 设置索引对应的item项属性 */
    let { tabs } = this.data
    tabs.forEach((v) =>
      v.index === index ? (v.isActive = true) : (v.isActive = false)
    )
    this.setData({ tabs })
  },
  /* 添加图片 */
  handleChooseImg(e) {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          tempFilePaths: [...this.data.tempFilePaths, ...res.tempFilePaths],
        })
      },
    })
  },
  /* 点击自定义组件的删除图标 */
  handleDelete(e) {
    /* 获取当前点击的索引 */
    const { index } = e.currentTarget.dataset
    /* 删除data中的数据 */
    const { tempFilePaths } = this.data
    tempFilePaths.splice(index, 1)
    this.setData({ tempFilePaths })
  },
  /* 监听文本输入框的变化 */
  handleInputChange(e) {
    const { value } = e.detail
    this.setData({
      inputValue: value,
    })
  },
  /* 提交 */
  handleSubmit(e) {
    /* 获取文本域内容 */
    const { inputValue, tempFilePaths } = this.data
    /* 合法性验证 */
    if (!inputValue.trim()) {
      /* 不合法 */
      showToast('输入不合法')
      return
    }
    wx.showLoading({
      title: '上传中',
      mask: true,
    })
    /* 判断是否有上传的图片数组 */
    if (tempFilePaths.length !== 0) {
      tempFilePaths.forEach((v, i) => {
        /* 准备上传图片到专门的图片服务器 */
        /* 上传文件的api不支持 多个文件同时上传 遍历数组挨个上传 */
        wx.uploadFile({
          /* 开发者服务器的地址 */
          url: 'https://imgchr.com/i/MjaXxU',
          /* 被上传文件的路径 */
          filePath: v,
          /* 上传文件的名称 后台来获取文件 */
          name: 'file',
          /* 顺带的文本信息 */
          formData: {},
          success: (res) => {
            console.log(res)
            let url = res.cookies[0]
            console.log(url)
            //将成功上传到服务器到地址返回存储
            this.UpLoadImgs.push(url)
            console.log(this.UpLoadImgs)
            /* 所有的代码都上传完 才触发 */
            if (i === tempFilePaths.length - 1) {
              wx.hideLoading()
              console.log('把文本内容和外网图片数组提交到后台中！')
              /* 提交成功 重置页面 */
              this.setData({
                tempFilePaths: [],
                inputValue: '',
              })
              /* 跳回到上一页 */
              wx.navigateBack({
                delta: 1,
              })
            }
          },
        })
      })
    } else {
      wx.hideLoading()
      wx.navigateBack({
        delta: 1,
      })
      console.log('只是提交了文本')
    }
  },
})
