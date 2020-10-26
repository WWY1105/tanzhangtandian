// pages/shareCard/cardDetail/cardDetail.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      id: '',
      cardDesc: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if (options.id) {
        this.setData({
            id: options.id
        })
    }
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
this.getCardDesc()
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

    },
    getCardDesc() {
      let that = this;
      let id = this.data.activityId;
      app.util.request(that, {
          url: app.util.getUrl('/benefits/cards/'+this.data.id+'/grows'),
          method: 'GET',
          header: app.globalData.token
      }).then((res) => {
          console.log(res)
          if (res.code == 200) {
              wx.hideLoading()
              that.setData({
                  cardDesc: res.result
              })

          }
      })
  },
})