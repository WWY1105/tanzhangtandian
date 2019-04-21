// pages/home/home.js
//获取应用实例
  const app = getApp(), key = "86191bf891316ee5baec8a0d22b92b84";//申请的高德地图key
  let amapFile = require('../../utils/amap-wx.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    shops:[],
    page:1,
    location: {
      city: "021",
      name: "上海市"

    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let _self = this;
    this.data.status = true;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log("res")
        console.log(res) 
        if (res.errMsg == "getLocation:ok") {      
          _self.data.location.latitude = res.latitude;
          _self.data.location.longitude = res.longitude;        
          _self.loadCity(res.latitude, res.longitude); 
          _self.getshops()
        }else{
          console.log("地理位置授权失败");
          wx.showToast({
            title: "授权失败",
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },

  //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
  loadCity: function (latitude, longitude) {
    let _self = this;
    let myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      success: function (data) {
        let address = data[0].regeocodeData.addressComponent;
        wx.setStorageSync('location', {
          longitude: longitude,
          latitude: latitude,
          citycode: address.citycode,
          province: address.province
        });
        
        _self.data.location.location = address.citycode;
        app.globalData.location.code = _self.data.location.location;
        app.globalData.location.name = address.province;
        _self.setData({
          "location.city": _self.data.location.location,
          "location.name": address.province,
        })
        console.log("location")
        console.log(_self.data.location)
        // _self.data.status = false;
        //判断当前城市是否在数据库中
        // app.util.ajax({
        //   url: '/dict/city',
        //   success: function (res) {
        //     let data = res.data;
        //     if (data.code == 200) {
        //       for (var i in data.result) {
        //         if (data.result[i].code == app.globalData.location.code) {
        //           _self.initFn();
        //           return;
        //         }
        //       }
        //       wx.showModal({
        //         title: '提示',
        //         content: "当前城市尚未开通上宾服务！",
        //         showCancel: false,
        //         success: function (res) {
        //           wx.hideTabBar();
        //           _self.data.status = false;
        //           wx.navigateTo({
        //             url: '../city/index'
        //           });
        //         }
        //       })
        //     } else if (data.code == 403000) {
        //     } else {
        //       console.log(info)
        //     }
        //   }
        // });
      },
      fail: function (info) {
        console.log(info)
      }
    });
  },

  getshops: function(put) {
    let _self = this;
    if (app.globalData.location.code) {
      _self.data.location.city = app.globalData.location.code;
      _self.data.location.name = app.globalData.location.name;
      _self.setData({
        "location": _self.data.location
      })
    }
    if (put){
      _self.setData({
        page: _self.data.page + 1
      })
    }else{
      _self.setData({
        page: 1
      })
    }
    wx.showLoading({
      title: '玩命加载中',
    })
    setTimeout(function () {
      console.log("app.globalData.token")
      console.log(app.globalData.token)
      let json = {
        "city": _self.data.location.city,
        "location": _self.data.location.location,
        // "latitude": _self.data.location.latitude,
        // "longitude": _self.data.location.longitude,
        "count": 10,
        "page": _self.data.page
      }
      console.log("json")
      console.log(json)
      wx.request({
        url: app.util.getUrl('/shop/shops', json),
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
          console.log(_self.data.shops)
        }
      });
    }, 300)
  },

  redirectCity: function () {
    wx.navigateTo({
      url: '../city/city'
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
    this.getshops(); 
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("push")
    this.getshops(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})