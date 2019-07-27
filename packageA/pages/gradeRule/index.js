// pages/gradeRule/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    init:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: app.util.getUrl('/spotter/rule'),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        
        let data = res.data;
        //console.log(data)
        var timer = setTimeout(function () {
          that.setData({
            init: false
          })
          wx.hideLoading();
          clearTimeout(timer)
        }, 500)
        if (data.code == 200) {
          that.setData({
            posts: data.result
          })
         
        } else {
          wx.showToast({
            title: data.message,
            duration: 2000
          });
        }

      },
      fail: function(res) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '网络超时',
          showCancel: false,
          confirmText: '重试',
          success(res) {
            if (res.confirm) {
              that.onLoad()
            } 
          }
        })
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