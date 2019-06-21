//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        data: '',
        location:{},//定位获取的地址，
        choose: {},//上次选择的城市
    },
    onShow() {
        let _self = this;
        var storgeLoc = wx.getStorageSync('location')
        this.setData({
          "location.code": storgeLoc.locationCode,
          "location.name": storgeLoc.locationName,
          "choose.code": storgeLoc.chooseCode,
          "choose.name": storgeLoc.chooseName

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
    },
    directFn: function (e) {
       var storgeLoc = wx.getStorageSync('location')
        wx.setStorageSync('location', {
          longitude: storgeLoc.longitude,
          latitude : storgeLoc.latitude,
          locationCode: storgeLoc.locationCode,
          locationName: storgeLoc.locationName,
          chooseCode: e.currentTarget.dataset.code,
          chooseName: e.currentTarget.dataset.name
        });
        wx.switchTab({
          url: '../home/home'
        })
    }
})
