// pages/buyCard/buyCard.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showPhonePop: false,
        instructions: '',
        activityId: '',
        promoteId: '',
        shopId: '',
        data: {},
        parentThis: '',
        buySuccessModal:false,//购买成功弹框
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            parentThis: this
        })
        if (options.activityId) {
            this.setData({
                activityId: options.activityId
            })
        }
        if (options.promoteId) {
            this.setData({
                promoteId: options.promoteId
            })
        }
        if (options.shopId) {
            this.setData({
                shopId: options.shopId
            })
        }

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
        this.getActivity()
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 获取活动详情
    getActivity() {
        let that = this;
        let url = '/cards/activity/' + this.data.activityId;
        app.util.request(that, {
            url: app.util.getUrl(url),
            method: 'GET',
            header: app.globalData.token
        }).then((res) => {
            wx.hideLoading();
            if (res.code == 200) {
                let instructions = '';
                if (res.result.instructions) {
                    instructions = app.convertHtmlToText(res.result.instructions)
                }
                that.setData({
                    data: res.result,
                    instructions
                })
            }
        })
    },
    // 去购买
    toBuy() {
        let url = "/cards";
        let that = this;
        let json = {
            id: this.data.shopId,
            goodsId: this.data.data.id, // 活动id
            count: 1
        };
        if (this.data.promoteId) {
            json.promoteId = this.data.promoteId
        }
        app.util.request(that, {
            url: app.util.getUrl(url),
            method: 'POST',
            header: app.globalData.token,
            data: json
        }).then((res) => {
            wx.hideLoading();
            if (res.code == 200) {
                // _wxPay
                app._wxPay(res.result.pay, function (res) {
                    that.setData({
                        buySuccessModal:true
                    })
                  })
            } else if (res.code == 403060) {
                that.setData({
                    showPhonePop: true
                })
            } else {
                wx.showToast({
                    title: res.message,
                    icon: "none",
                    duration: 2000
                })
            }
        })
    },
    // 拒绝手机号
    closePhonePop() {
        this.setData({
            showPhonePop: false
        })
    },
    // 获取电话号
    getPhoneNumber(e) {
        wx.showLoading({
            title: '加载中',
        })
        //console.log(e)
        var _self = this
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:user deny' || e.detail.errMsg == 'getPhoneNumber:fail:user deny') {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '未授权',
                success: function (res) {

                }
            })
            wx.hideLoading();
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
                    wx.hideLoading();
                    let data = res.data;
                    if (data.code == 200) {
                        if (data.result) {
                            wx.setStorageSync('token', data.result.token);
                            app.globalData.token.token = data.result.token
                        }
                        _self.setData({
                            showPhonePop: false
                        }, () => {
                            _self.toBuy()
                        })
                        wx.showToast({
                            title: "授权成功",
                            duration: 2000
                        });
                    } else {
                        wx.showToast({
                            title: data.message,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                }
            });
        }
    },

    // 关闭弹窗
    closeSuccess(){
        this.setData({
            sccessModal:false
        })
    },
})