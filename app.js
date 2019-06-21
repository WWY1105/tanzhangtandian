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
    function compareVersion(v1, v2) {
      v1 = v1.split('.')
      v2 = v2.split('.')
      const len = Math.max(v1.length, v2.length)

      while (v1.length < len) {
        v1.push('0')
      }
      while (v2.length < len) {
        v2.push('0')
      }

      for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
          return 1
        } else if (num1 < num2) {
          return -1
        }
      }

      return 0
    }

    const version = wx.getSystemInfoSync().SDKVersion

    if (compareVersion(version, '2.1.0') >= 0) {
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
    }
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
    ajaxOrigin: "https://saler.ishangbin.com",
    urlOrigin: "https://saler.ishangbin.com"
  },
  util: util
})