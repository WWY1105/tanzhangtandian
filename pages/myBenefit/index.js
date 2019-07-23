// pages/myBenefit/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:'',
    searchLoadingComplete:false,
    searchLoading: false,
    page:1,
    parentThis: '',
    posts:''
  },
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    var that = this
    this.setData({
      page:1,
      posts: ''
    })
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
      if (cur == 0) {
        var json = {
          page:1,
          count:10,
          state:4001
        }
        that.getBenefit(json)
      } else if (cur == 1) {
        var json = {
          page: 1,
          count: 10,
          state: 4002
        }
        that.getBenefit(json)
      } else {
        var json = {
          page: 1,
          count: 10,
          state: 4003
        }
        that.getBenefit(json)
      }

    }
  },
  getBenefit(json){
    var that = this
    app.util.request(that, {
      url: app.util.getUrl('/benefits/coupons', json),
      method: 'GET',
      header: app.globalData.token
    }).then((res)=>{
      if(res.code == 200){
        that.setData({
          posts: res.result.items,
          pageSize: res.result.pageSize
        })
      }else{
        that.setData({
          posts: '',
          pageSize: ''
        })
      }
    })
  },
  toCouponDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../coupon/coupon?id=" + id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      parentThis: this
    })
    var json = {
      page: 1,
      count: 10,
      state: 4001
    }
    that.getBenefit(json)
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
    var that = this
    this.setData({
      page: this.data.page+1
    })
    if (this.data.page>this.data.pageSize){
      return false;
    }
    if (this.data.currentTab == 0) {
      var json = {
        page: that.data.page,
        count: 10,
        state: 4001
      }
      that.getBenefit(json)
    } else if (this.data.currentTab == 1) {
      var json = {
        page: that.data.page,
        count: 10,
        state: 4002
      }
      that.getBenefit(json)
    } else {
      var json = {
        page: that.data.page,
        count: 10,
        state: 4003
      }
      that.getBenefit(json)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})