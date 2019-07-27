// pages/friend/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var json = {
      "count": 20,
      "page": 1
    }
    //console.log(options)
    wx.request({
      url: app.util.getUrl('/tasks/task/' + options.id +'/obatiner', json),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        if (options.state){
          data.result.state = options.state
        }
        
        //console.log(options.state)
        if (data.code == 200) {
          that.setData({
            posts: data.result
          })

        } else {
          // wx.showToast({
          //   title: data.message,
          //   duration: 2000
          // });
        }

      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})