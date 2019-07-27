// pages/profit/profit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimg: "../../img/userimg.png",
    page:1,
    info:'',
    list:'',
    pageSize:1,
    init:true
  },
  showToast() {
    wx.showToast({
      title: '更多功能, 敬请期待',
      icon: 'none',
      duration: 2000
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      page: 1,
    })
    // app.util.request(that, {
    //   url: app.util.getUrl('/tasks/profits'),
    //   method: 'GET',
    //   header: app.globalData.token
    // }).then((res) => {
    //   if (res.code == 200) {
    //     wx.hideLoading();
    //     that.setData({
    //       info: data.result
    //     })
    //     //console.log(that.data.info)
    //   }
    // })

    wx.request({
      url: app.util.getUrl('/tasks/profits'),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        //console.log(res)
        if(res.data.code == 200){
          that.setData({
            info: res.data.result
          })
          if (that.data.info.amount>0){
            that.getList()
          }else{
            that.setData({
              init: false
            })
          }
        }
      },
      fail(res) {
        //console.log(res)
        wx.showToast({
          title: data.message,
          duration: 2000
        })
      }
    });
    

  },
  getList(put) {
   
    var that=this
    if (put) {
      this.setData({
        page: that.data.page + 1,
      })
      var json = {
        page: this.data.page,
        count: 20
      }
    }else{
      var json = {
        page: this.data.page,
        count: 20
      }
    }
    if (that.data.page > that.data.pageSize) {
      wx.hideLoading();
      return false;
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.util.getUrl('/tasks/profits/record',json),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        var timer = setTimeout(function () {
          that.setData({
            init: false
          })
          wx.hideLoading();
          clearTimeout(timer)
        }, 500)
        
        //console.log(res)
        if (res.data.code == 200) {
          if(put){
            that.setData({
              list: that.data.list.concat(res.data.result.items),
              pageSize: res.data.result.pageSize
            })
          }else{
            that.setData({
              list: res.data.result.items,
              pageSize: res.data.result.pageSize
            })
          }
        }
      },
      fail(res) {
        var timer = setTimeout(function () {
          that.setData({
            init: false
          })
          clearTimeout(timer)
        }, 500)
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
    this.onLoad();
    var timer = setTimeout(function () {
      wx.stopPullDownRefresh();
      clearTimeout(timer)
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList(true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})