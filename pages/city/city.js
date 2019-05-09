//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        data: '',
        location: "",//定位获取的地址，
        cityLocation: "",//缓存中取出来的
    },
    onShareAppMessage: function () {
        return {
            title: '预定越早，优惠越大！',
            imageUrl: "/images/share3.png",
            path: '/pages/brand/index',
            success(res) {
                console.log(res);
            }
        }
    },
    onShow() {
        let _self = this;
        this.setData({
          cityLocation: app.globalData.location
        })
        app.util.ajax({
            url: '/dict/city',
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
        });
        if (wx.getStorageSync('location')) {
            this.setData({
                location: wx.getStorageSync('location')
            })
        }
    },
    directFn: function (e) {
      console.log(e.currentTarget.dataset.name)
        app.globalData.location.code = e.currentTarget.dataset.code;
        app.globalData.location.name = e.currentTarget.dataset.name;
        wx.switchTab({
          url: '../home/home'
        })
    }
})
