// pages/shareCard/joinShare/joinShare.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showPhonePop: false,
        id: '',
        instructions: '',
        successModal: false,
        data: {},
        maxDiscount: 0,
        showShopNum: 2
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
        }, false).then((res) => {
            console.log(res)
            if (res.code == 200) {
                wx.hideLoading()
                let instructions = '';
                if (res.result.instructions) {
                    instructions = app.convertHtmlToText(res.result.instructions)
                }

                let maxDiscount = 0;
                if (res.result.card.orgAmount && res.result.card.limit) {
                    maxDiscount = res.result.card.orgAmount - res.result.card.limit;
                    maxDiscount = Math.round(maxDiscount * 100) / 100
                }
                that.setData({
                    data: res.result,
                    instructions,
                    maxDiscount
                })

            }
        })
    },
    againRequest() {
        this.toJoin()
    },

    // 查看所有门店
    showAllShop() {
        let length = this.data.data.shops.length;
        let showShopNum = this.data.showShopNum;
        if (showShopNum == 2) {
            showShopNum = length
        } else {
            showShopNum = 2
        }
        this.setData({
            showShopNum
        })
    },
    // 
    // 去加入
    toJoin() {
        let url = "/shares/" + this.data.data.id;
        let that = this;
        //   ---------------------
        if (this.data.data.needPhone) {
            that.setData({
                showPhonePop: true
            });
            return;
        }
        if (this.data.data.obtained) {
            wx.showModal({
                title: '抱歉，您已领取过了',
            })
            return;
        }

        // ----------------------





        let json = {};
        app.util.request(that, {
            url: app.util.getUrl(url),
            method: 'POST',
            header: app.globalData.token,
            data: json
        }).then((res) => {
            wx.hideLoading();
            console.log(res)
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
                    title: res.message || '加入失败',
                    icon: "none",
                    duration: 2000
                })
            }
        })
    },
    // 关闭弹窗
    closeSuccess() {
        this.setData({
            successModal: false
        },()=>{
            // 加入成功，去卡详情
            let id = this.data.data.id;
            wx.redirectTo({
                url: '/pages/shareCard/myCardDesc/myCardDesc?id='+id,
            })
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

    // 打电话
    makePhoneCall(e){
        let phone=e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone,
            success:function(){
              console.log('拨打成功')
            },
            fail:function(){
              console.log('拨打失败')
            }
          })
    }

})