//app.js
const util = require('./utils/util.js');
App({
  onLaunch: function (options) {
    var that = this
    this.globalData.scene = options.scene
    console.log(options.scene)
    console.log(options)
    if (wx.getStorageSync('token')) {
      this.globalData.token.token = wx.getStorageSync('token');
    } else {
      
    }
    wx.getUserInfo({      
      success(res) {
        that.globalData.userInfo = res.userInfo
      }
    })
    wx.loadFontFace({
      family: 'FZFSJW',
      source: 'url("https://saler.sharejoy.cn/static/font/FZFSJW.ttf")',
      success: function (res) {
        console.log("字体加载成功") //  loaded
      },

      fail: function (res) {
        console.log("字体加载失败") //  erro
        console.log(res)

      }
    })
  },
  checksession: function () {
    wx.checkSession({
      success: function (res) {
        console.log(res, '登录未过期')
        wx.showToast({
          title: '登录未过期了',
        })
      },
      fail: function (res) {
        console.log(res, '登录过期了')
        // wx.showModal({
        //   title: '提示',
        //   content: '你的登录信息过期了，请重新登录',
        // })
        //再次调用wx.login()
        wx.login({
          success: function (res) {
           
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null,
    userPhone: null,
    token: {
      'apiKey': '6b774cc5eb7d45818a9c7cc0a4b6920f'
    },
    scene:'',
    location: {},
    ajaxOrigin: "https://saler.sharejoy.cn",
    urlOrigin: "https://saler.sharejoy.cn"
  },
  util: util
})