export const request = (params) => {
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resovle, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (res) => {
        resovle(res.data.message)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
