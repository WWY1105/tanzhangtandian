//index.js
//获取应用实例
const app = getApp();
let id = "";
let activityId = "";
let brand = ''
Page({
    data: {
      data: '',
      items : [],
    },
  onLoad: function (options) { 
    //页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
    id = options.id; //  券id
    brand = options.brand;
    wx.setNavigationBarTitle({
      title: brand
    })
  },
  onShow : function () {
    let _self = this;
    app.util.ajax({
      url: '/coupons/' +id,
      success: function (res) {
        let data = res.data;
        if(data.code == 200 ) {
          _self.setData({
              data: data.result,
          })
        }else {
          wx.showToast({
              title: data.message,
              icon: 'none',
              duration: 2000
          });
        }
      }
    })
  },
    
})
