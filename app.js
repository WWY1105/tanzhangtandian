//app.js
const util = require('./utils/util.js');
App({
  onLaunch: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
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
    console.log("检查版本更新是否支持")
    if (!wx.canIUse("getUpdateManager")) return;
    console.log("支持")
    let updateManager = wx.getUpdateManager();
    // 获取全局唯一的版本更新管理器，用于管理小程序更新
    console.log("调用api")
    updateManager.onCheckForUpdate(function (res) {
      // 监听向微信后台请求检查更新结果事件 
      console.log("是否有新版本：" + res.hasUpdate);
      if (res.hasUpdate) {
        //如果有新版本                
        // 小程序有新版本，会主动触发下载操作        
        updateManager.onUpdateReady(function () {
          //当新版本下载完成，会进行回调          
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，单击确定重启小程序',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启小程序               
                updateManager.applyUpdate();
              }
            }
          })
        })
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）        
        updateManager.onUpdateFailed(function () {
          //当新版本下载失败，会进行回调          
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请稍后尝试',
            showCancel: false,
          })
        })
      }
    });
    // function compareVersion(v1, v2) {
    //   v1 = v1.split('.')
    //   v2 = v2.split('.')
    //   const len = Math.max(v1.length, v2.length)

    //   while (v1.length < len) {
    //     v1.push('0')
    //   }
    //   while (v2.length < len) {
    //     v2.push('0')
    //   }

    //   for (let i = 0; i < len; i++) {
    //     const num1 = parseInt(v1[i])
    //     const num2 = parseInt(v2[i])

    //     if (num1 > num2) {
    //       return 1
    //     } else if (num1 < num2) {
    //       return -1
    //     }
    //   }

    //   return 0
    // }

    // const version = wx.getSystemInfoSync().SDKVersion

    // if (compareVersion(version, '2.1.0') >= 0) {
    //   wx.loadFontFace({
    //     family: 'FZFSJW',
    //     source: 'url("https://saler.sharejoy.cn/static/font/FZFSJW.ttf")',
    //     success: function (res) {
    //       console.log("字体加载成功") //  loaded
    //     },

    //     fail: function (res) {
    //       console.log("字体加载失败") //  erro
    //       console.log(res)

    //     }
    //   })
    // }

    
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
    // ajaxOrigin: "https://saler.ishangbin.com",
    // urlOrigin: "https://saler.ishangbin.com"
  },
  util: util
})