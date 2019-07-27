// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parentThis: '',
    code:'',
    user:'',
    info:'',
    phonePop:false,
    showPhonePop:false,
    codepop:false
  },
  againRequest() {
    this.onShow();
  },
  getPhoneNumber(e) {
    wx.showLoading({
      title: '加载中',
    })
    //console.log(e)
    var _self = this
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:user deny' || e.detail.errMsg == 'getPhoneNumber:fail:user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {

        }
      })
      wx.hideLoading();
    } else {

      wx.request({
        url: app.util.getUrl('/phone/bind'),
        method: 'POST',
        data: {
          "iv": e.detail.iv,
          "encryptedData": e.detail.encryptedData,
        },
        header: app.globalData.token,
        success: function (res) {
          //console.log("/phone/bind")
          //console.log(res)
          wx.hideLoading();
          let data = res.data;
          if (data.code == 200) {
            if (data.result) {
              wx.setStorageSync('token', data.result.token);
              app.globalData.token.token = data.result.token
            }
            _self.setData({
              showPhonePop: false,
              codepop: true,
              phonePop: true
            })
            wx.showToast({
              title: "授权成功",
              duration: 2000
            });
          } else {
            wx.showToast({
              title: data.message,
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    }
  },
  toGradeRule() {
    wx.navigateTo({
      url: '/packageA/pages/gradeRule/index'
    })
  },
  toMyApprentice() {
    wx.navigateTo({
      url: '/packageA/pages/myApprentice/index'
    })
  },
  toProfit() {
    wx.navigateTo({
      url: '/packageA/pages/profit/profit'
    })
  },
  toMyBenefit() {
    wx.navigateTo({
      url: '/packageA/pages/myBenefit/index'
    })
  },
  toMyTask() {
    wx.switchTab({
      url: '/pages/mytask/index'
    })
  },
  showToast() {
    wx.showToast({
      title: '更多功能, 敬请期待',
      icon: 'none',
      duration: 2000
    })
  },
  hiddenPop() {
    this.setData({
      codepop:false,
      code:''
    })
  },
  showPop() {
    if (this.data.phonePop){
      this.setData({
        showPhonePop: true
      })
    }else{
      this.setData({
        codepop: true
      })
    }
    
  },
  getValue(e) {
    this.setData({
      code: e.detail.value
    })
  },
  postCode() {
    var that = this
    if (!this.data.code){
      wx.showToast({
        title: '不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var json = {
      code: this.data.code
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //console.log(this.data.code)
    wx.request({
      url: app.util.getUrl('/spotter/cdkey'),
      method: 'POST',
      data: json,
      header: app.globalData.token,
      success: function (res) {
        //console.log(res)
        //console.log(res.data.code)
        wx.hideLoading();
        if(res.data.code == 200){
          wx.showToast({
            title: '使用成功',
            icon: 'success',
            duration: 2000
          })
          //console.log("成功") 
                 
          var timer = setTimeout(function(){
            that.hiddenPop();            
            clearTimeout(timer)
            that.onShow()            
          },1000)
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.message + ''
          })
        }
      },
      fail: function(res){
        wx.showModal({
          title: '提示',
          content: res.data.message+''
        })
      }
    })
  },
  closePhonePop() {
    this.setData({
      showPhonePop: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      parentThis: this
    })
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
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    
    
    app.util.request(that, {
      url: app.util.getUrl('/spotter'),
      method: 'GET',
      header: app.globalData.token
    }).then((subres) => {
      wx.hideLoading();
      if (subres.code == 200) {
        wx.hideLoading();
        that.setData({
          info: subres.result
        })
        //console.log(that.data.info)
        if (wx.getStorageSync('userInfo') || wx.getStorageSync('phoneNum')) {
          that.setData({
            user: wx.getStorageSync('userInfo'),
            phonePop: false
          })
          console.log(wx.getStorageSync('userInfo'))
        } else {
          app.util.request(that, {
            url: app.util.getUrl('/user'),
            method: 'GET',
            header: app.globalData.token
          }).then((res) => {
            console.log(res)
            if (res.code == 200) {
              that.setData({
                user: res.result
              })
              wx.setStorageSync('userInfo', res.result)
              if (res.result.phone) {
                wx.setStorageSync('phoneNum', res.result.phone)
                that.setData({
                  phonePop: false
                })
              } else {
                wx.setStorageSync('phoneNum', false)
                that.setData({
                  phonePop: true
                })
              }
            }
          })
        }
      }
    })
    
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
    var that = this
    this.onShow()
    var timer = setTimeout(function () {
      wx.stopPullDownRefresh();
      clearTimeout(timer)
    }, 1000)
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