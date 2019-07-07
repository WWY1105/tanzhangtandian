// pages/home/home.js
//获取应用实例
  const app = getApp(), key = "86191bf891316ee5baec8a0d22b92b84";//申请的高德地图key
  let amapFile = require('../../utils/amap-wx.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dirCity: {"021":1, "010":1, "022":1, "023":1},
    shops:'',
    page:1,
    pageSize:'',
    citys:{},
    location: {
      city: "021",
      name: "上海",
      longitude: "",
      latitude: "",
      location:'021'
    },
    firstimg:false,
    phonePop:false,
    init:true
  },
  toShop: function(e){
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../shop/index?id=' + id
    })
  },
  toShare(e) {
    var _self = this
    var id = e.currentTarget.dataset.id;
    var json = {id:id}
    wx.request({
      url: app.util.getUrl('/tasks'),
      method: 'POST',
      header: app.globalData.token,
      data: json,
      success: function (res) {
        let data = res.data;
        if(data.code == '200'){
          wx.showModal({
            title: '提示',
            content: '领取成功',
            showCancel: false,
            confirmText:'去赚赏金',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../share/share?id=' + data.result.taskId
                })
              }
            }
          })
         
        } else if (data.code == 403060) {
          wx.hideLoading();
          if (new Date().getTime() > 1562234940000) {
            _self.setData({
              phonePop: true
            })
          }

        }  else if (data.code == 403000) {
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '../index/index'
          })
        }

      }
    });
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    
    let _self = this;
    this.data.status = true;
    this.getshops()
    var timer = setTimeout(function(){
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          wx.hideLoading()
          if (res.errMsg == "getLocation:ok") {
            _self.data.location.latitude = res.latitude;
            _self.data.location.longitude = res.longitude;
            _self.setData({
              "location.longitude": res.longitude,
              "location.latitude": res.latitude,
            })
            app.util.ajax({
              url: '/dict/city',
              success: function (cityres) {
                let citydata = cityres.data;
                if (citydata.code == 200) {
                  var city = {};
                  for (var v in citydata.result) {
                    city[citydata.result[v].code] = citydata.result[v].name
                  }
                  _self.setData({
                    citys: city
                  })
                  _self.loadCity(res.latitude, res.longitude);
                } else {
                  wx.showToast({
                    title: citydata.message,
                    icon: 'none',
                    duration: 2000
                  });
                }

              }
            });

            // _self.loadCity(30.25, 120.123); //模拟杭州
            // _self.loadCity(31.78, 119.95); //模拟常州

          } else {
            console.log("地理位置授权失败");
            wx.showToast({
              title: "授权失败",
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail(res) {
          _self.getshops()
          console.log("地理位置获取失败")
          console.log(res);
        }
      })
      clearTimeout(timer)
    },1000)
    
    if(!wx.getStorageSync('first')){
      _self.setData({
        firstimg: true
      })
      wx.setStorageSync('first', true) 
    }else(
      _self.setData({
        firstimg: false
      })
    )
  },
  closeFirstImg(){
    this.setData({
      firstimg: false
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
        console.log(address)
        var locCity = address.citycode;
        
        var locationCityNme = (address.city.length== 0)? address.province : address.city;
        _self.setData({
          "location.location": locCity
        })
        var citys = _self.data.citys
        var openCityNme = _self.data.citys[locCity]
        console.log(openCityNme)
        if (openCityNme){
          console.log("已开通")
          var storLoc = wx.getStorageSync("location")
          if ((!storLoc && locCity == '021') || (storLoc && locCity == storLoc.chooseCode)){
            console.log("一致")
            _self.setData({
              "location.city": locCity,
              "location.name": openCityNme,
            })
            _self.saveLocation(longitude, latitude, locCity, openCityNme, locCity, locationCityNme)
            _self.getshops()
          }else{
            //选择城市与定位城市不一致,需要询问用户是否需要切换到定位城市
            console.log("不一致")
            wx.showModal({
              title: '提示',
              confirmText: '切换',
              content: '检测到您当前定位在 ' + locationCityNme + ',是否切换到 ' + locationCityNme,
              success(res) {
                if (res.confirm) {
                  _self.setData({
                    "location.city": locCity,
                    "location.name": locationCityNme,
                  })
                  _self.saveLocation(longitude, latitude, locCity, openCityNme, locCity, locationCityNme)
                  
                  _self.getshops()
                } else if (res.cancel) {
                  var storLoc = wx.getStorageSync("location")
                  console.log(storLoc.locationCode)
                  console.log(storLoc.city)
                  _self.setData({
                    "location.city": storLoc.chooseCode,
                    "location.name": storLoc.chooseName,
                  })
                  _self.getshops()
                }
              }
            })
          }
        }else{
          console.log("未开通")
          //用户定位城市还未开通服务,则默认帮用户切换到上海
          wx.showModal({
            title: '提示',
            confirmText: '确认',
            showCancel:'false',
            content: '您所在的城市[' + locationCityNme + ']暂未开通探长探店服务,我们将带您去上海',
            success(res) {
              if (res.confirm) {
                _self.setData({
                  "location.city": "021",
                  "location.name": "上海",
                })
                _self.saveLocation(longitude, latitude, '021', '上海', locCity, locationCityNme)
                
                _self.getshops() 
              }
              

            }
          })
               

        }
      },
      fail: function (info) {
        _self.getshops()
        console.log("解析失败")
      }
    });
  },
  changeShop: function() {
    var page = Math.floor(Math.random() * this.data.pageSize + 1)
    this.setData({
      page: page
    })
    this.getshops()
  },
  getPhoneNumber(e) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(e)

    if (new Date().getTime() < 1562234940000) {
      return;
    }


    var _self = this
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {
          wx.hideLoading();
          _self.setData({
            phonePop: true
          })
        }
      })
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
          console.log("/phone/bind")
          console.log(res)
          wx.hideLoading();
          let data = res.data;
          if (data.code == 200 || data.code == 405025) {
            if (data.result) {
              wx.setStorageSync('token', data.result.token);
              app.globalData.token.token = data.result.token
            }
            _self.setData({
              phonePop: false
            })
            wx.showToast({
              title: "授权成功",
              duration: 2000
            });
            _self.onLoad()
          } else {
            // wx.showToast({
            //   title: data.message,
            //   duration: 2000
            // });
          }
        }
      });
    }
  },
  getshops: function(put) {
    let _self = this;
    // if (put){
    //   if (_self.data.pageSize && _self.data.pageSize == this.data.page) {
    //     console.log("禁止请求")
    //     return;
    //   }
    //   _self.setData({
    //     page: _self.data.page + 1
    //   })
    // }else{
    //   _self.setData({
    //     page: 1
    //   })
    // }
    if(!this.data.page){
      _self.setData({
        page: 1
      })
    }
    
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      let json = {
        "city": _self.data.location.city,
        "location": _self.data.location.location,
        "latitude": _self.data.location.latitude,
        "longitude": _self.data.location.longitude,
        "count": 10,
        "page": _self.data.page
      }
      console.log("json")
      console.log(json)
      wx.request({
        url: app.util.getUrl('/tasks/tasks', json),
        method: 'GET',
        header: app.globalData.token,
        success: function (res) {
          let data = res.data;
          console.log(data)
          if (data.code == 200) {
            _self.setData({
              pageSize: data.result.pageSize,
              shops: data.result.items,
              init: false
            })
            // if (put) {
            //   console.log('ok')
            //   console.log(_self.data.shops)
            //   _self.setData({
            //     shops: _self.data.shops.concat(data.result.items)
            //   })
            // } else {
            //   _self.setData({
            //     shops: data.result.items
            //   })
            // }
            wx.hideLoading();

          } else if (data.code == 403000) {
            wx.removeStorageSync('token')
            wx.navigateTo({
              url: "../index/index"
            })
          } else if (data.code == 404000) {
            wx.hideLoading();
            _self.setData({
              shops: '',
              init: false
            })
          } else if (data.code == 403060) {
            wx.hideLoading();
            if (new Date().getTime() > 1562151607000) {
              _self.setData({
                phonePop: true,
                init:false
              })
            }
            
          } else {
            _self.setData({
              shops: ''
            })
            wx.showToast({
              title: data.message,
              duration: 2000
            });
          }
          wx.hideLoading();
        },
        fail: function(){
          wx.hideLoading();
        }
      });
      
    }, 300)
  },

  redirectCity: function () {
    wx.navigateTo({
      url: '../city/city'
    })
  },
  //获取城市列表并保存{}
  getcity () {
    var that = this
    app.util.ajax({
      url: '/dict/city',
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          var city={};
          for (var v in data.result){
            city[data.result[v].code] = data.result[v].name
          }
          _self.setData({
            citys: city
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000
          });
        }
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
    this.setData({
      phonePop: false
    })

    var storage = wx.getStorageSync('location')
    if (storage && storage.chooseCode) {
      this.setData({
        "location.city": storage.chooseCode,
        "location.name": storage.chooseName
      })
      this.getshops()
      console.log("页面显示")
    }
    
   
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
    // this.getshops(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  saveLocation: function(longitude, latitude, chooseCode, chooseName, locationCode, locationName){
    wx.setStorageSync('location', {
      longitude: longitude,
      latitude: latitude,
      chooseCode: chooseCode,
      chooseName: chooseName,
      locationCode: locationCode,
      locationName: locationName
    });
  }
})