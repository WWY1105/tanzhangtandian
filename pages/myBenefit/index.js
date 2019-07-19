// pages/myBenefit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:'',
    items:[],
    searchLoadingComplete:false,
    searchLoading: false
  },
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur,
        items: []
      })
      if (cur == 0) {
        let _self = this;
        // app.util.ajax({
        //   url: '/benefits/coupons/guest/' + guestId,
        //   data: {
        //     page: 1,
        //     count: 10
        //   },
        //   success: function (res) {
        //     let data = res.data;
        //     if (data.code == 200) {
        //       _self.setData({
        //         items: data.result.items,
        //         pageSize: data.result.pageSize,
        //         pageNum: 1
        //       })
        //     } else {
        //       _self.setData({
        //         items: '',
        //       })

        //     }
        //   }
        // })
      } else if (cur == 1) {
        this.setData({
          searchLoadingComplete: false,
          searchLoading: false,
        })
        let _self = this;
        // app.util.ajax({
        //   url: '/benefits/coupons/guest/' + guestId + '/used',
        //   data: {
        //     page: 1,
        //     count: 10
        //   },
        //   success: function (res) {
        //     let data = res.data;
        //     if (data.code == 200) {
        //       _self.setData({
        //         items: data.result.items,
        //         pageSize: data.result.pageSize,
        //         pageNum: 1
        //       })

        //     } else {
        //       _self.setData({
        //         items: '',
        //       })
        //     }
        //   }
        // })
      } else {
        this.setData({
          searchLoadingComplete: false,
          searchLoading: false,
        })
        let _self = this;
        // app.util.ajax({
        //   url: '/benefits/coupons/guest/' + guestId + '/overdue',
        //   data: {
        //     page: 1,
        //     count: 10
        //   },
        //   success: function (res) {
        //     let data = res.data;
        //     if (data.code == 200) {
        //       _self.setData({
        //         items: data.result.items,
        //         pageSize: data.result.pageSize,
        //         pageNum: 1
        //       })

        //     } else {
        //       _self.setData({
        //         items: '',
        //       })
        //     }
        //   }
        // })
      }

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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