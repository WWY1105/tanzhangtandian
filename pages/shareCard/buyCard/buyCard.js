// pages/buyCard/buyCard.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showShopNum: 2,
        orderId:'',
        showPhonePop: false,
        instructions: '',
        activityId: '',
        promoteId: '',
        shopId: '',
        data: {},
        parentThis: '',
        buySuccessModal:false,//购买成功弹框
        purchase:''
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
        },false).then((res) => {
            wx.hideLoading();
            if (res.code == 200) {
                let instructions = '';
                let purchase=''
                function formatRichText(html) {
                    let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
                       match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
                       match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
                       match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
                       return match;
                    });
                    newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
                       match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/max-width:[^;]+;/gi, 'max-width:100%;');
                       return match;
                    });
                    newContent = newContent.replace(/<br[^>]*\/>/gi, '');
                    newContent = newContent.replace(/em[^>]*\/>/gi, '%');
                    newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;width:auto!important;height:auto;display:block;margin-top:0;margin-bottom:0;"');
                    newContent = newContent.replace(/\<li/gi, '*<li style="list-style-type:none;display:inline-block"');
                    return newContent;
                 }
                if (res.result.instructions) {
                        instructions = formatRichText(res.result.instructions)
                }
                if (res.result.purchase) {
                    purchase = formatRichText(res.result.purchase)
                }
                console.log(purchase)
                that.setData({
                    data: res.result,
                    instructions,
                    purchase
                })
            }
        })
    },
    againRequest(){
        this.toBuy()
    },
    cancelPay(orderId) {
        let that = this;
        let url = '/pay/revoke/order/' +orderId;
        let data = {};
        app.util.request(that, {
           url: app.util.getUrl(url),
           method: 'POST',
           header: app.globalData.token,
           data: data
        }).then((res) => {
           if (res.code == 200) {
            that.setData({
                buySuccessModal:false
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
                if(res.result.orderId){
                    this.setData({orderId:res.result.orderId})
                }
                if(res.result.pay){
                    app._wxPay(res.result.pay, function (data) {
                        that.setData({
                            buySuccessModal:true
                        },()=>{
                            that.getActivity()
                        })
                      },()=>{
                        console.log('支付失败')
                        that.cancelPay(res.result.orderId)
                      })
                }else{
                    that.setData({
                        buySuccessModal:true
                    })
                }
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
            buySuccessModal:false
        },()=>{
            console.log('跳转卡详情')
            wx.redirectTo({
                url: '/pages/shareCard/myCardDesc/myCardDesc?orderId='+this.data.orderId,
              })
        })
    },
})