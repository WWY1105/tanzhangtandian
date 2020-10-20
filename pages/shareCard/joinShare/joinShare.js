// pages/shareCard/joinShare/joinShare.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        instructions: '',
        successModal:false,
        data: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id) {
            this.setData({
                id: options.id
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
        this.getCardDesc()
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
        return {
            title: '分享',
            // path:'/pages/shareCard/joinShare/joinShare?id' = this.data.id
        }
    },
    // 获取卡列表
    getCardDesc() {
        let that = this;
        let id = this.data.id;
        app.util.request(that, {
            url: app.util.getUrl('/shares/' + id),
            method: 'GET',
            header: app.globalData.token
        }).then((res) => {
            console.log(res)
            if (res.code == 200) {
                wx.hideLoading()
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
    toJoin() {
        let url = "/shares/"+this.data.data.id;
        let that = this;
        let json = {
            // id: this.data.shopId,
            // goodsId: this.data.data.id, // 活动id
            // count: 1
        };
        app.util.request(that, {
            url: app.util.getUrl(url),
            method: 'POST',
            header: app.globalData.token,
            data: json
        }).then((res) => {
            wx.hideLoading();
            if (res.code == 200) {
                that.setData({
                    successModal: true
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
                            _self.toJoin()
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

})