///logs.js
const app = getApp();
let guestId = "";
Page({
    data: {
      data: [],
      currentTab: 0, //预设当前项的值
      menu  : false,
      items : [],
      pageSize: '',
      pageNum: 1,   // 设置加载的第几次，默认是第一次
      searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
      searchLoading: false  //“没有数据”的变量，默认false，隐藏
    },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    guestId = options.guestId;
    if (this.data.pageNum == this.data.pageSize) {
      return;
    }
    this.setData({
      searchLoadingComplete: false,
      searchLoading: false,
    })
    // 请求可使用的券
    var _self = this;
    app.util.ajax({
      url: '/benefits/coupons/guest/' + guestId,
      data: {
        page: 1,
        count: 10
      },
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          _self.setData({
            items: data.result.items,
            pageSize: data.result.pageSize,
          })
        }else {
          _self.setData({
            items: '',
          })
        }
      }
    })
  },  
  //上拉分页,将页码加1，然后调用分页函数getbrand()
  onReachBottom: function () {
    var that = this;
    if (that.data.pageNum < that.data.pageSize) {
      var pageNum = that.data.pageNum;
      that.setData({
        pageNum: ++pageNum,
        searchLoading: true   //把"上拉加载"的变量设为false，显示
      });
      setTimeout(function () {
        that.getbrand();
        if (that.data.searchLoadingComplete) {
          that.setData({
            searchLoading: false   //把"上拉加载"的变量设为false，显示
          });
        }
      }, 1000)
    } else {
      that.setData({
        searchLoading: false,  //把"上拉加载"的变量设为false，显示
        searchLoadingComplete: true
      });
    }
  },
  onShow: function () {
    if (this.data.pageNum == this.data.pageSize) {
      return;
    }
    this.setData({
      searchLoadingComplete: false,
      searchLoading: false,
    })
    let _self = this;
    app.util.ajax({
      url: '/benefits/guest/' + guestId,
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          _self.setData({
            data: data.result,
          })
         
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  getbrand : function () {
    var cur = this.data.currentTab
    if (cur == 0) {
      let _self = this;
      app.util.ajax({
        url: '/benefits/coupons/guest/' + guestId,
        data: {
          page: this.data.pageNum,
          count: 10
        },
        success: function (res) {
          let data = res.data;
          if (data.code == 200) {
            _self.setData({
              items: _self.data.items.concat(data.result.items)
            })
            
          } else {
            _self.setData({
              searchLoadingComplete: true,
              searchLoading: false,
            })
          }
        }
      })
    } else if (cur == 1) {
      let _self = this;
      app.util.ajax({
        url: '/benefits/coupons/guest/' + guestId + '/used',
        data: {
          page: this.data.pageNum,
          count: 10
        },
        success: function (res) {
          let data = res.data;
          if (data.code == 200) {
            _self.setData({
              items: _self.data.items.concat(data.result.items)
            })
            
          } else {
            _self.setData({
              items: '',
            })
          }
        }
      })
    } else {
      let _self = this;
      app.util.ajax({
        url: '/benefits/coupons/guest/' + guestId + '/overdue',
        data: {
          page: this.data.pageNum,
          count: 10
        },
        success: function (res) {
          let data = res.data;
          if (data.code == 200) {
            _self.setData({
              items: _self.data.items.concat(data.result.items)
            })
            
          } else {
            _self.setData({
              items: '',
            })
          }
        }
      })
    }
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur,
        items : []
      })
      if(cur == 0) {
        let _self = this;
        app.util.ajax({
          url: '/benefits/coupons/guest/' + guestId,
          data: {
            page: 1,
            count : 10
          },
          success: function (res) {
            let data = res.data;
            if (data.code == 200) {
              _self.setData({
                items: data.result.items,
                pageSize: data.result.pageSize,
                pageNum : 1
              })
            } else {
              _self.setData({
                items: '',
              })
             
            }
          }
        })
      }else if (cur == 1) {
        this.setData({
          searchLoadingComplete: false,
          searchLoading: false,
        })
        let _self = this;
        app.util.ajax({
          url: '/benefits/coupons/guest/' + guestId+'/used',
          data: {
            page: 1,
            count: 10
          },
          success: function (res) {
            let data = res.data;
            if (data.code == 200) {
              _self.setData({
                items: data.result.items,
                pageSize: data.result.pageSize,
                pageNum: 1
              })
              
            } else {
              _self.setData({
                items: '',
              })
            }
          }
        })
      } else {
        this.setData({
          searchLoadingComplete: false,
          searchLoading: false,
        })
        let _self = this;
        app.util.ajax({
          url: '/benefits/coupons/guest/' + guestId +'/overdue',
          data: {
            page: 1,
            count: 10
          },
          success: function (res) {
            let data = res.data;
            if (data.code == 200) {
              _self.setData({
                items: data.result.items,
                pageSize: data.result.pageSize,
                pageNum: 1
              })
              
            } else {
              _self.setData({
                items: '',
              })
            }
          }
        })
      }
      
    }
  },
  // height : function () {
  //   //  高度自适应
  //   var that =this;
  //   wx.getSystemInfo({
  //     success: function (res) {
  //       var clientHeight = res.windowHeight,
  //         clientWidth = res.windowWidth,
  //         rpxR = 750 / clientWidth;
  //         console.log(res);
  //       var calc = clientHeight * rpxR;
  //       console.log(calc)
  //       that.setData({
  //         winHeight: clientHeight
  //       });
  //     }
  //   });
  // },
  tobrand : function () {
    wx.switchTab({
      url: '/pages/brand/index'
    })
  },
  touser: function () {
    wx.switchTab({
      url: '/pages/user/index'
    })
  },
  showmenu : function () {
    this.setData ({
      menu : !this.data.menu
    })
  },
  stopTouchMove: function () {
    return false;
  },
})
