<<<<<<< HEAD
// pages/home/home.js
//获取应用实例
const app = getApp(),
   key = "86191bf891316ee5baec8a0d22b92b84"; //申请的高德地图key
let amapFile = require('../../utils/amap-wx.js');
var event = '';
Page({
   /**
    * 页面的初始数据
    */
   data: {
      showLoading:true,
      noRankData: false,
      dirCity: {
         "021": 1,
         "010": 1,
         "022": 1,
         "023": 1
      },
      resourceType: {
         "1014": "充值金额",
         "1015": "积分",
         "1016": "券",
         "1017": "代用币",
         "1018": "红票",
         "1019": "储值卡"
      },
      citys: {},
      userInfo: '',
      cardList: '',
      taskList: '',
      showBuyCardPop: false,
      chooseCode: '',
      location: {
         city: "021",
         name: "上海",
         longitude: "",
         latitude: "",
         location: '021'
      },
      currentTab: '0',
      rankList: '',
      rankSpotter: '',
      firstimg: false,
      phonePop: false,
      init: true,
      parentThis: '',
      showImg: '',
      toAuth: true,
      lock: false,
      // ---------
      shops: [],
      rankPageSize: '',

      rankPage: 1,
      pageSize: '',
      page: 1,
      // 分页数量
      count: 20, //每页5条数据
      hasMoreData: true,
      isRefreshing: false,
      isLoadingMoreData: false,
      height: 0, //手机视口高度
      scrollTop: 0,
      scrollFlag: false,
      startX: 0,
      moveLeft: 0,
      keyword: '',
      ongoingRebates: 0,
      damoHeight: '30',//demo高度
      array: [],
      total: 0,
      switchConfirm: true,//是否切换城市
   },
   // --------------
   // 查看我正在发的红包
   red_envelopes_ing() {
      wx.navigateTo({
         url: '/packageA/pages/red_envelopes_ing/index'
      })
   },
   // 获取我的红包数量
   getMyRed() {
      var that = this;
      var url = app.util.getUrl('/spotter')
      wx.request({
         url: url,
         method: 'GET',
         header: app.globalData.token,
         success: function (res) {
            let data = res.data;
            if (data.code == 200) {
               that.setData({
                  ongoingRebates: data.result.ongoingRebates
               })

            } else if (data.code == 403000) {
               wx.removeStorageSync('token')
            } else {

            }
         }
      })
   },
   //  获取用户详情
   getUserInfo() {
      let that = this;
      if (wx.getStorageSync('userInfo')) {
         wx.hideLoading()
      } else {
         app.util.request(that, {
            url: app.util.getUrl('/user'),
            method: 'GET',
            header: app.globalData.token
         }).then((res) => {
            console.log(res)
            if (res.code == 200) {
               wx.hideLoading()
               that.setData({
                  user: res.result
               })
               wx.setStorageSync('userInfo', res.result)

            }
         })
      }
   },
   // 收益排行
   getRankList(put) {
      var that = this;
      // 不传的时候说明从第一页开始
      if (!put) {
         that.setData({
            rankPage: 1
         })
      }
      let json = {
         "count": this.data.count,
         "page": this.data.rankPage
      }
      wx.request({
         url: app.util.getUrl('/profits/rank', json),
         method: 'GET',
         header: app.globalData.token,
         success: function (res) {
            if (res.data.code == 200) {
               if (put) {
                  that.setData({
                     rankPageSize: res.data.result.pageSize,
                     rankList: that.data.rankList.concat(res.data.result.items),
                  })
               } else {
                  that.setData({
                     rankPageSize: res.data.result.pageSize,
                     rankList: res.data.result.items,
                     init: false
                  })
               }
               // if (that.data.rankList.length>0){
               //    that.setData({})
               // }
               wx.hideLoading();
            } else {
               that.setData({
                  rankList: ""
               })
            }
         },
         fail(res) {
            //console.log(res)
            wx.showToast({
               title: data.message,
               duration: 2000
            })
         }
      })
   },
   // -------------------
   swichNav: function (e) {
      var cur = e.target.dataset.current;
      var that = this
      console.log(cur)
      if (that.data.currentTaB == cur) {
         return false;
      } else {
         that.setData({
            currentTab: cur,
         })
         if (cur == 0) {
            // rankList 收益排行
            if (!that.data.rankList) { }
         }
         if (cur == 1) {
            //  收益排行
            that.getRankList(false);// 从第一页开始加载
            that.setData({
               hasMoreData: false,
               isLoadingMoreData: false,
               hasMoreData: false
            })


         }
      }
      this.pageScrollToBottom()
   },
   scrollTopFn() {
      wx.pageScrollTo({
         scrollTop: 0
      })
   },
   // 获取容器高度，使页面滚动到容器底部
   pageScrollToBottom: function () {
      wx.pageScrollTo({
         scrollTop: this.data.scrollTop
      })

   },

   // 监听tabbar点击事件
   onTabItemTap: function (item) {
      if (item.index == 0) {

      }
   },
   /**
    * 监听页面滚动
    */
   onPageScroll: function (e) {
      let scrollTop = e.scrollTop;
      this.setData({
         scrollTop
      })
      let _this = this;
      // 懒加载
      var str = parseInt(scrollTop / _this.data.damoHeight);
      _this.data.array[str] = true;
      _this.setData({
         array: _this.data.array
      })
   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {
      // isRefreshing 整个分页容器
      // isLoadingMoreData 正在加载更多
      // hasMoreData 点击加载更多
      console.log()
      let flag = true;
      // 商家列表
      if (this.data.currentTab == 0) {
         if (this.data.page < this.data.pageSize) {
            this.setData({
               page: this.data.page + 1
            })
            this.getshops(true);
         } else {
            // 没有数据了
            this.setData({
               hasMoreData: false,
               isLoadingMoreData: false
            })
            return false;
         }
      }





      //   收益排行
      if (this.data.currentTab == 1) {
         if (this.data.rankPage < this.data.rankPageSize) {
            this.setData({
               rankPage: this.data.rankPage + 1
            })
            this.getRankList(true);
         } else {
            // 没有数据了
            this.setData({
               hasMoreData: false,
               isLoadingMoreData: false
            })
            return false;
         }
      }

      if (!flag) {
         // 没有数据了
         this.setData({
            hasMoreData: false,
            isLoadingMoreData: false
         })
      }
      if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
         return false;
      }
      console.log('到底不了')


   },

   // 获取商店列表
   getshops: function (put) {
      
      let that = this;
      if (!put) {
         that.setData({
            page: 1
         })
      }
   
         let json = {
           
            "location": that.data.location.location,
            "latitude": that.data.location.latitude,
            "longitude": that.data.location.longitude,
            "count": that.data.count,
            "page": that.data.page,
            "city": that.data.location.city||"021",
            "keyword": encodeURIComponent(that.data.keyword)
         }
         wx.request({
            url: app.util.getUrl('/shops', json),
            method: 'GET',
            header: app.globalData.token,
            success: function (res) {
               that.setData({showLoading:false})
               let data = res.data;
               if (data.code == 200) {
                  data.result.items.forEach(function (i, j) {
                     if (i.picUrl) {
                        i.smallPic = i.picUrl.split('_org').join('')
                     }

                  })
                  that.setData({
                     total: data.result.total
                  })
                  if (put) {
                     that.setData({
                        pageSize: data.result.pageSize,
                        shops: that.data.shops.concat(data.result.items),
                     })
                  } else {
                     that.setData({
                        pageSize: data.result.pageSize,
                        shops: data.result.items,
                        init: false
                     })
                  }
                  wx.hideLoading();
               } else if (data.code == 403000) {
                  wx.removeStorageSync('token')

               } else if (data.code == 404000) {
                  wx.hideLoading();
                  that.setData({
                     shops: '',
                     init: false
                  })
               } else if (data.code == 403060) {
                  wx.hideLoading();
                  if (new Date().getTime() > 1562151607000) {
                     that.setData({
                        phonePop: true,
                        init: false
                     })
                  }
               } else {
                  that.setData({
                     shops: ''
                  })
                  wx.showToast({
                     title: data.message,
                     duration: 2000
                  });
               }
               wx.hideLoading();
            },
            fail: function (res) {
               wx.hideLoading();
               wx.showModal({
                  title: '提示',
                  content: '网络超时',
                  showCancel: false,
                  confirmText: '重试',
                  success(res) {
                     if (res.confirm) {
                        that.onShow()
                     }
                  }
               })
            }
         });

  

   },

   againRequest() {

   },
   toRanking: app.util.throttle(function () {
      wx.navigateTo({
         url: '/packageA/pages/ranking/index'
      })
   }),
   toGoldExperience: app.util.throttle(function () {
      wx.navigateTo({
         url: '/packageA/pages/goldExperience/index'
      })
   }),
   toGuide: app.util.throttle(function () {
      wx.navigateTo({
         url: '/packageA/pages/guide/index'
      })
   }),
   toGradeRule: app.util.throttle(function () {
      wx.navigateTo({
         url: '/packageA/pages/gradeRule/index'
      })
   }),

   // 防止多次点击
   toShopDetail: app.util.throttle(function (e) {
      var id = e.currentTarget.dataset.id;
      // 发起者
      wx.navigateTo({
         url: '/pages/shopDetail/index?id=' + id
      })


   }),
   /**
    * 生命周期函数--监听页面加载
    */
   watch: {

      scrollTop: {
         handler(newValue) {
            if (newValue > 200) {
               this.setData({
                  scrollFlag: true
               })
            } else {
               this.setData({
                  scrollFlag: false
               })
            }
         },
         deep: true
      }
   },
   onLoad: function () {
      this.setData({
         parentThis: this
      })
      this.data.array[this.data.activeLazy] = true;
      this.setData({
         array: this.data.array
      })
   },
   //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
   loadCity: function (latitude, longitude) {
      let that = this;
      let myAmapFun = new amapFile.AMapWX({
         key: key
      });
      myAmapFun.getRegeo({
         location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
         success: function (data) {
            console.log('loadCity')
            console.log(data)
            let address = data[0].regeocodeData.addressComponent;
            var locCity = address.citycode;
            var locationCityNme = (address.city.length == 0) ? address.province : address.city;
            that.setData({
               "location.location": locCity
            })
            var citys = that.data.citys
            var openCityNme = that.data.citys[locCity]
            //console.log(openCityNme)
            if (openCityNme) {
               //console.log("已开通")
               var storLoc = wx.getStorageSync("location")
               if ((!storLoc && locCity == '021') || (storLoc && locCity == storLoc.chooseCode)) {
                  //console.log("一致")
                  that.setData({
                     "location.city": locCity,
                     "location.name": openCityNme,
                  })
                  that.saveLocation(longitude, latitude, locCity, openCityNme, locCity, locationCityNme)
                 
                  that.getshops();
               } else {
                  //选择城市与定位城市不一致,需要询问用户是否需要切换到定位城市
                  //console.log("不一致")
                  if (!that.data.switchConfirm) {
                     return false;
                  }
                  console.log('是否切换' + that.data.switchConfirm)
                  wx.showModal({
                     title: '提示',
                     confirmText: '切换',
                     content: '检测到您当前定位在 ' + locationCityNme + ',是否切换到 ' + locationCityNme,
                     success(res) {
                        // 点击切换
                        if (res.confirm) {
                           that.setData({
                              "location.city": locCity,
                              "location.name": locationCityNme,
                              'chooseCode': locCity,
                              'switchConfirm': true
                           })
                           that.saveLocation(longitude, latitude, locCity, openCityNme, locCity, locationCityNme)
                           that.getshops()

                        } else if (res.cancel) {
                           // 不切换
                           var storLoc = wx.getStorageSync("location")
                           //console.log(storLoc.locationCode)
                           //console.log(storLoc.city)
                           that.setData({
                              "location.city": storLoc.chooseCode,
                              "location.name": storLoc.chooseName,
                              'switchConfirm': false
                           })
                           // that.getTaskList();
                           // that.getCard();
                        }
                     }
                  })
               }
            } else {
               //console.log("未开通")
               //用户定位城市还未开通服务,则默认帮用户切换到上海
               wx.showModal({
                  title: '提示',
                  confirmText: '确认',
                  showCancel: 'false',
                  content: '您所在的城市[' + locationCityNme + ']暂未开通赛朋服务,我们将带您去上海',
                  success(res) {
                     if (res.confirm) {
                        that.setData({
                           "location.city": "021",
                           "location.name": "上海",
                        })
                        that.saveLocation(longitude, latitude, '021', '上海', locCity, locationCityNme)

                        // that.getTaskList();
                        // that.getCard();
                     }


                  }
               })


            }
         },
         fail: function (info) {
            console.log("解析失败")
         }
      });
   },
   getPhoneNumber(e) {
      wx.showLoading({
         title: '加载中',
         mask: true
      })

      if (new Date().getTime() < 1562234940000) {
         return;
      }


      var that = this
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:user deny') {
         wx.showModal({
            title: '提示',
            showCancel: false,
            content: '未授权',
            success: function (res) {
               wx.hideLoading();
               that.setData({
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
               //console.log("/phone/bind")
               //console.log(res)
               wx.hideLoading();
               let data = res.data;
               if (data.code == 200 || data.code == 405025) {
                  if (data.result) {
                     wx.setStorageSync('token', data.result.token);
                     app.globalData.token.token = data.result.token
                  }
                  that.setData({
                     phonePop: false
                  })
                  wx.showToast({
                     title: "授权成功",
                     duration: 2000
                  });
                  that.againRequest()
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

   redirectCity: function () {
      wx.navigateTo({
         url: '../city/city'
      })
   },
   login() {
      var that = this
      wx.login({
         success: res => {
            if (res.code) {
               that.setData({
                  code: res.code
               })
               //发起网络请求
               wx.request({
                  url: app.util.getUrl('/auth'),
                  method: 'POST',
                  header: app.globalData.token,
                  data: {
                     code: res.code
                  },
                  success: function (res) {
                     let data = res.data;
                     if (data.code == 200) {
                        if (data.result.token) {
                           wx.setStorageSync('token', data.result.token);
                           app.globalData.token.token = data.result.token;
                        }
                        // that.getUser();
                        that.setData({
                           toAuth: false
                        })
                     } else {
                        // that.getshops()
                     }
                  },
                  fail: function () {
                     // that.getshops()
                  }
               })
            }
         },
         fail: function () {
            // that.getshops()
         }
      })
   },
   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {
      this.getUserInfo()
   },
   onHide() {
      console.log('onHide')
   },
   //   搜索商家
   shopInput(e) {
      let keyword = e.detail.value;
      this.setData({ keyword });

   },

   searchShop() {
      let that = this;
      console.log(that.data.keyword)
      this.getshops();
   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {
      var that = this;
      var storage = wx.getStorageSync('location');
      let location=this.data.location;
      if(storage){
         location=storage
      }
      this.setData({
         phonePop: false,
         location
      })


      // if (this.data.chooseCode != storage.chooseCode) {
         this.getshops()
      // }


      if (storage && storage.chooseCode) {
         this.setData({
            "location.city": storage.chooseCode,
            "location.name": storage.chooseName,
            'chooseCode': storage.chooseCode
         })
         console.log('选择位置以后')

         console.log(storage.chooseCode)
         //console.log("页面显示")
      }


      // 获取我正在发的红包
      // this.getMyRed();
      if (!wx.getStorageSync('token')) {
         that.login()
      } else {
         //  that.getUser()
         that.setData({
            toAuth: false
         })
      }
      // 获取系统信息
      wx.getSystemInfo({
         success: function (res) {
            // 获取可使用窗口宽度
            let clientHeight = res.windowHeight;
            // 获取可使用窗口高度
            let clientWidth = res.windowWidth;
            // 算出比例
            let ratio = 750 / clientWidth;
            // 算出高度(单位rpx)
            let height = clientHeight * ratio;
            // 设置高度
            that.setData({
               height: height
            });
         }
      })
      // ----------------------------------------------------------------------
     
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
      this.onLoad()
      var timer_ = setTimeout(function () {
         wx.stopPullDownRefresh();
         clearTimeout(timer_)
      }, 1000)
   },


   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {

   },

   saveLocation: function (longitude, latitude, chooseCode, chooseName, locationCode, locationName) {
      let json = {
         longitude: longitude,
         latitude: latitude,
         chooseCode: chooseCode,
         chooseName: chooseName,
         locationCode: locationCode,
         locationName: locationName
      }

      this.setData({
         'location.longitude': longitude,
         'location.latitude': latitude,
         'location.name': locationName,
         'location.city': locationCode,
         'location.location': locationCode
      },()=>{
         console.log('执行了');
         console.log(this.data.location)
      })
      wx.setStorageSync('location', json);
   },

=======
// pages/home/home.js
//获取应用实例
const app = getApp(),
   key = "86191bf891316ee5baec8a0d22b92b84"; //申请的高德地图key
let amapFile = require('../../utils/amap-wx.js');
var event = '';
Page({
   /**
    * 页面的初始数据
    */
   data: {
      showLoading:true,
      noRankData: false,
      dirCity: {
         "021": 1,
         "010": 1,
         "022": 1,
         "023": 1
      },
      resourceType: {
         "1014": "充值金额",
         "1015": "积分",
         "1016": "券",
         "1017": "代用币",
         "1018": "红票",
         "1019": "储值卡"
      },
      citys: {},
      userInfo: '',
      cardList: '',
      taskList: '',
      showBuyCardPop: false,
      chooseCode: '',
      location: {
         city: "021",
         name: "上海",
         longitude: "",
         latitude: "",
         location: '021'
      },
      currentTab: '0',
      rankList: '',
      rankSpotter: '',
      firstimg: false,
      phonePop: false,
      init: true,
      parentThis: '',
      showImg: '',
      toAuth: true,
      lock: false,
      // ---------
      shops: [],
      rankPageSize: '',

      rankPage: 1,
      pageSize: '',
      page: 1,
      // 分页数量
      count: 20, //每页5条数据
      hasMoreData: true,
      isRefreshing: false,
      isLoadingMoreData: false,
      height: 0, //手机视口高度
      scrollTop: 0,
      scrollFlag: false,
      startX: 0,
      moveLeft: 0,
      keyword: '',
      ongoingRebates: 0,
      damoHeight: '30',//demo高度
      array: [],
      total: 0,
      switchConfirm: true,//是否切换城市
   },
   // --------------
   // 查看我正在发的红包
   red_envelopes_ing() {
      wx.navigateTo({
         url: '/packageA/pages/red_envelopes_ing/index'
      })
   },
   // 获取我的红包数量
   getMyRed() {
      var that = this;
      var url = app.util.getUrl('/spotter')
      wx.request({
         url: url,
         method: 'GET',
         header: app.globalData.token,
         success: function (res) {
            let data = res.data;
            if (data.code == 200) {
               that.setData({
                  ongoingRebates: data.result.ongoingRebates
               })

            } else if (data.code == 403000) {
               wx.removeStorageSync('token')
            } else {

            }
         }
      })
   },
   //  获取用户详情
   getUserInfo() {
      let that = this;
      if (wx.getStorageSync('userInfo')) {
         wx.hideLoading()
      } else {
         app.util.request(that, {
            url: app.util.getUrl('/user'),
            method: 'GET',
            header: app.globalData.token
         }).then((res) => {
            console.log(res)
            if (res.code == 200) {
               wx.hideLoading()
               that.setData({
                  user: res.result
               })
               wx.setStorageSync('userInfo', res.result)

            }
         })
      }
   },
   // 收益排行
   getRankList(put) {
      var that = this;
      // 不传的时候说明从第一页开始
      if (!put) {
         that.setData({
            rankPage: 1
         })
      }
      let json = {
         "count": this.data.count,
         "page": this.data.rankPage
      }
      wx.request({
         url: app.util.getUrl('/profits/rank', json),
         method: 'GET',
         header: app.globalData.token,
         success: function (res) {
            if (res.data.code == 200) {
               if (put) {
                  that.setData({
                     rankPageSize: res.data.result.pageSize,
                     rankList: that.data.rankList.concat(res.data.result.items),
                  })
               } else {
                  that.setData({
                     rankPageSize: res.data.result.pageSize,
                     rankList: res.data.result.items,
                     init: false
                  })
               }
               // if (that.data.rankList.length>0){
               //    that.setData({})
               // }
               wx.hideLoading();
            } else {
               that.setData({
                  rankList: ""
               })
            }
         },
         fail(res) {
            //console.log(res)
            wx.showToast({
               title: data.message,
               duration: 2000
            })
         }
      })
   },
   // -------------------
   swichNav: function (e) {
      var cur = e.target.dataset.current;
      var that = this
      console.log(cur)
      if (that.data.currentTaB == cur) {
         return false;
      } else {
         that.setData({
            currentTab: cur,
         })
         if (cur == 0) {
            // rankList 收益排行
            if (!that.data.rankList) { }
         }
         if (cur == 1) {
            //  收益排行
            that.getRankList(false);// 从第一页开始加载
            that.setData({
               hasMoreData: false,
               isLoadingMoreData: false,
               hasMoreData: false
            })


         }
      }
      this.pageScrollToBottom()
   },
   scrollTopFn() {
      wx.pageScrollTo({
         scrollTop: 0
      })
   },
   // 获取容器高度，使页面滚动到容器底部
   pageScrollToBottom: function () {
      wx.pageScrollTo({
         scrollTop: this.data.scrollTop
      })

   },

   // 监听tabbar点击事件
   onTabItemTap: function (item) {
      if (item.index == 0) {

      }
   },
   /**
    * 监听页面滚动
    */
   onPageScroll: function (e) {
      let scrollTop = e.scrollTop;
      this.setData({
         scrollTop
      })
      let _this = this;
      // 懒加载
      var str = parseInt(scrollTop / _this.data.damoHeight);
      _this.data.array[str] = true;
      _this.setData({
         array: _this.data.array
      })
   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {
      // isRefreshing 整个分页容器
      // isLoadingMoreData 正在加载更多
      // hasMoreData 点击加载更多
      console.log()
      let flag = true;
      // 商家列表
      if (this.data.currentTab == 0) {
         if (this.data.page < this.data.pageSize) {
            this.setData({
               page: this.data.page + 1
            })
            this.getshops(true);
         } else {
            // 没有数据了
            this.setData({
               hasMoreData: false,
               isLoadingMoreData: false
            })
            return false;
         }
      }





      //   收益排行
      if (this.data.currentTab == 1) {
         if (this.data.rankPage < this.data.rankPageSize) {
            this.setData({
               rankPage: this.data.rankPage + 1
            })
            this.getRankList(true);
         } else {
            // 没有数据了
            this.setData({
               hasMoreData: false,
               isLoadingMoreData: false
            })
            return false;
         }
      }

      if (!flag) {
         // 没有数据了
         this.setData({
            hasMoreData: false,
            isLoadingMoreData: false
         })
      }
      if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
         return false;
      }
      console.log('到底不了')


   },

   // 获取商店列表
   getshops: function (put) {
      
      let that = this;
      if (!put) {
         that.setData({
            page: 1
         })
      }
   
         let json = {
           
            "location": that.data.location.location,
            "latitude": that.data.location.latitude,
            "longitude": that.data.location.longitude,
            "count": that.data.count,
            "page": that.data.page,
            "city": that.data.location.city||"021",
            "keyword": encodeURIComponent(that.data.keyword)
         }
         wx.request({
            url: app.util.getUrl('/shops', json),
            method: 'GET',
            header: app.globalData.token,
            success: function (res) {
               that.setData({showLoading:false})
               let data = res.data;
               if (data.code == 200) {
                  data.result.items.forEach(function (i, j) {
                     if (i.picUrl) {
                        i.smallPic = i.picUrl.split('_org').join('')
                     }

                  })
                  that.setData({
                     total: data.result.total
                  })
                  if (put) {
                     that.setData({
                        pageSize: data.result.pageSize,
                        shops: that.data.shops.concat(data.result.items),
                     })
                  } else {
                     that.setData({
                        pageSize: data.result.pageSize,
                        shops: data.result.items,
                        init: false
                     })
                  }
                  wx.hideLoading();
               } else if (data.code == 403000) {
                  wx.removeStorageSync('token')

               } else if (data.code == 404000) {
                  wx.hideLoading();
                  that.setData({
                     shops: '',
                     init: false
                  })
               } else if (data.code == 403060) {
                  wx.hideLoading();
                  if (new Date().getTime() > 1562151607000) {
                     that.setData({
                        phonePop: true,
                        init: false
                     })
                  }
               } else {
                  that.setData({
                     shops: ''
                  })
                  wx.showToast({
                     title: data.message,
                     duration: 2000
                  });
               }
               wx.hideLoading();
            },
            fail: function (res) {
               wx.hideLoading();
               wx.showModal({
                  title: '提示',
                  content: '网络超时',
                  showCancel: false,
                  confirmText: '重试',
                  success(res) {
                     if (res.confirm) {
                        that.onShow()
                     }
                  }
               })
            }
         });

  

   },

   againRequest() {

   },
   toRanking: app.util.throttle(function () {
      wx.navigateTo({
         url: '/packageA/pages/ranking/index'
      })
   }),
   toGoldExperience: app.util.throttle(function () {
      wx.navigateTo({
         url: '/packageA/pages/goldExperience/index'
      })
   }),
   toGuide: app.util.throttle(function () {
      wx.navigateTo({
         url: '/packageA/pages/guide/index'
      })
   }),
   toGradeRule: app.util.throttle(function () {
      wx.navigateTo({
         url: '/packageA/pages/gradeRule/index'
      })
   }),

   // 防止多次点击
   toShopDetail: app.util.throttle(function (e) {
      var id = e.currentTarget.dataset.id;
      // 发起者
      wx.navigateTo({
         url: '/pages/shopDetail/index?id=' + id
      })


   }),
   /**
    * 生命周期函数--监听页面加载
    */
   watch: {

      scrollTop: {
         handler(newValue) {
            if (newValue > 200) {
               this.setData({
                  scrollFlag: true
               })
            } else {
               this.setData({
                  scrollFlag: false
               })
            }
         },
         deep: true
      }
   },
   onLoad: function () {
      this.setData({
         parentThis: this
      })
      this.data.array[this.data.activeLazy] = true;
      this.setData({
         array: this.data.array
      })
   },
   //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
   loadCity: function (latitude, longitude) {
      let that = this;
      let myAmapFun = new amapFile.AMapWX({
         key: key
      });
      myAmapFun.getRegeo({
         location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
         success: function (data) {
            console.log('loadCity')
            console.log(data)
            let address = data[0].regeocodeData.addressComponent;
            var locCity = address.citycode;
            var locationCityNme = (address.city.length == 0) ? address.province : address.city;
            that.setData({
               "location.location": locCity
            })
            var citys = that.data.citys
            var openCityNme = that.data.citys[locCity]
            //console.log(openCityNme)
            if (openCityNme) {
               //console.log("已开通")
               var storLoc = wx.getStorageSync("location")
               if ((!storLoc && locCity == '021') || (storLoc && locCity == storLoc.chooseCode)) {
                  //console.log("一致")
                  that.setData({
                     "location.city": locCity,
                     "location.name": openCityNme,
                  })
                  that.saveLocation(longitude, latitude, locCity, openCityNme, locCity, locationCityNme)
                 
                  that.getshops();
               } else {
                  //选择城市与定位城市不一致,需要询问用户是否需要切换到定位城市
                  //console.log("不一致")
                  if (!that.data.switchConfirm) {
                     return false;
                  }
                  console.log('是否切换' + that.data.switchConfirm)
                  wx.showModal({
                     title: '提示',
                     confirmText: '切换',
                     content: '检测到您当前定位在 ' + locationCityNme + ',是否切换到 ' + locationCityNme,
                     success(res) {
                        // 点击切换
                        if (res.confirm) {
                           that.setData({
                              "location.city": locCity,
                              "location.name": locationCityNme,
                              'chooseCode': locCity,
                              'switchConfirm': true
                           })
                           that.saveLocation(longitude, latitude, locCity, openCityNme, locCity, locationCityNme)
                           that.getshops()

                        } else if (res.cancel) {
                           // 不切换
                           var storLoc = wx.getStorageSync("location")
                           //console.log(storLoc.locationCode)
                           //console.log(storLoc.city)
                           that.setData({
                              "location.city": storLoc.chooseCode,
                              "location.name": storLoc.chooseName,
                              'switchConfirm': false
                           })
                           // that.getTaskList();
                           // that.getCard();
                        }
                     }
                  })
               }
            } else {
               //console.log("未开通")
               //用户定位城市还未开通服务,则默认帮用户切换到上海
               wx.showModal({
                  title: '提示',
                  confirmText: '确认',
                  showCancel: 'false',
                  content: '您所在的城市[' + locationCityNme + ']暂未开通赛朋服务,我们将带您去上海',
                  success(res) {
                     if (res.confirm) {
                        that.setData({
                           "location.city": "021",
                           "location.name": "上海",
                        })
                        that.saveLocation(longitude, latitude, '021', '上海', locCity, locationCityNme)

                        // that.getTaskList();
                        // that.getCard();
                     }


                  }
               })


            }
         },
         fail: function (info) {
            console.log("解析失败")
         }
      });
   },
   getPhoneNumber(e) {
      wx.showLoading({
         title: '加载中',
         mask: true
      })

      if (new Date().getTime() < 1562234940000) {
         return;
      }


      var that = this
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:user deny') {
         wx.showModal({
            title: '提示',
            showCancel: false,
            content: '未授权',
            success: function (res) {
               wx.hideLoading();
               that.setData({
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
               //console.log("/phone/bind")
               //console.log(res)
               wx.hideLoading();
               let data = res.data;
               if (data.code == 200 || data.code == 405025) {
                  if (data.result) {
                     wx.setStorageSync('token', data.result.token);
                     app.globalData.token.token = data.result.token
                  }
                  that.setData({
                     phonePop: false
                  })
                  wx.showToast({
                     title: "授权成功",
                     duration: 2000
                  });
                  that.againRequest()
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

   redirectCity: function () {
      wx.navigateTo({
         url: '../city/city'
      })
   },
   login() {
      var that = this
      wx.login({
         success: res => {
            if (res.code) {
               that.setData({
                  code: res.code
               })
               //发起网络请求
               wx.request({
                  url: app.util.getUrl('/auth'),
                  method: 'POST',
                  header: app.globalData.token,
                  data: {
                     code: res.code
                  },
                  success: function (res) {
                     let data = res.data;
                     if (data.code == 200) {
                        if (data.result.token) {
                           wx.setStorageSync('token', data.result.token);
                           app.globalData.token.token = data.result.token;
                        }
                        // that.getUser();
                        that.setData({
                           toAuth: false
                        })
                     } else {
                        // that.getshops()
                     }
                  },
                  fail: function () {
                     // that.getshops()
                  }
               })
            }
         },
         fail: function () {
            // that.getshops()
         }
      })
   },
   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {
      this.getUserInfo()
   },
   onHide() {
      console.log('onHide')
   },
   //   搜索商家
   shopInput(e) {
      let keyword = e.detail.value;
      this.setData({ keyword });

   },

   searchShop() {
      let that = this;
      console.log(that.data.keyword)
      this.getshops();
   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {
      var that = this;
      var storage = wx.getStorageSync('location');
      let location=this.data.location;
      if(storage){
         location=storage
      }
      this.setData({
         phonePop: false,
         location
      })


      // if (this.data.chooseCode != storage.chooseCode) {
         this.getshops()
      // }


      if (storage && storage.chooseCode) {
         this.setData({
            "location.city": storage.chooseCode,
            "location.name": storage.chooseName,
            'chooseCode': storage.chooseCode
         })
         console.log('选择位置以后')

         console.log(storage.chooseCode)
         //console.log("页面显示")
      }


      // 获取我正在发的红包
      // this.getMyRed();
      if (!wx.getStorageSync('token')) {
         that.login()
      } else {
         //  that.getUser()
         that.setData({
            toAuth: false
         })
      }
      // 获取系统信息
      wx.getSystemInfo({
         success: function (res) {
            // 获取可使用窗口宽度
            let clientHeight = res.windowHeight;
            // 获取可使用窗口高度
            let clientWidth = res.windowWidth;
            // 算出比例
            let ratio = 750 / clientWidth;
            // 算出高度(单位rpx)
            let height = clientHeight * ratio;
            // 设置高度
            that.setData({
               height: height
            });
         }
      })
      // ----------------------------------------------------------------------
     
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
      this.onLoad()
      var timer_ = setTimeout(function () {
         wx.stopPullDownRefresh();
         clearTimeout(timer_)
      }, 1000)
   },


   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {

   },

   saveLocation: function (longitude, latitude, chooseCode, chooseName, locationCode, locationName) {
      let json = {
         longitude: longitude,
         latitude: latitude,
         chooseCode: chooseCode,
         chooseName: chooseName,
         locationCode: locationCode,
         locationName: locationName
      }

      this.setData({
         'location.longitude': longitude,
         'location.latitude': latitude,
         'location.name': locationName,
         'location.city': locationCode,
         'location.location': locationCode
      },()=>{
         console.log('执行了');
         console.log(this.data.location)
      })
      wx.setStorageSync('location', json);
   },

>>>>>>> 9056447025cbdd237457b7734f223eb7ddb1dae7
})