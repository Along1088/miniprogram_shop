//发送请求的次数
let requestTimes = 0
export const request = (params) => {
  //判断url中是否带有/my/ 请求的是私有路径 带上header和token
  let header = {...params.header}
  if (params.url.includes('/my/')) {
    //凭借header 带上token
    header['Authorization'] = wx.getStorageSync('token')
  }
  requestTimes++
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resovle, reject) => {
    wx.request({
      ...params,
      header,
      url: baseUrl + params.url,
      success: (res) => {
        resovle(res.data.message)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        requestTimes--
        if (requestTimes === 0) {
          wx.hideLoading()
        }
      },
    })
  })
}
