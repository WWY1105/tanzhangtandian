// pages/welfare/welfare.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimg: "http://photocdn.sohu.com/20050905/Img226866286.jpg",
    shops:[],
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getshops: function(put){
    var _self = this
    
    if (put) {
      _self.setData({
        page: _self.data.page + 1
      })
    } else {
      _self.setData({
        page: 1
      })
    }
    wx.showLoading({
      title: '玩命加载中',
    })
    var json = {
      "count": 20,
      "page": _self.data.page
    }
    wx.request({
      url: app.util.getUrl('/benefits', json),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;

        if (data.code == 200) {
          if (put) {
            console.log('ok')
            console.log(_self.data.shops)
            _self.setData({
              shops: _self.data.shops.concat(data.result.items)
            })
          } else {
            _self.setData({
              shops: data.result.items
            })
          }
          wx.hideLoading();

        } else {
          wx.showToast({
            title: data.message,
            duration: 2000
          });
        }

      }
    });
  },
  toCoupon: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../benefit/index?guestId='+id
    })
  },
  onLoad: function (options) {
    this.setData({
      nickName: app.globalData.userInfo.nickName,
      userimg: app.globalData.userInfo.avatarUrl
    })
    this.getshops()
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
    this.getshops();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getshops(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})