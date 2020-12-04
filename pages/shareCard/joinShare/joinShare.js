// pages/shareCard/joinShare/joinShare.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showLoading:true,
        successMsg:'',
        errorMsgModal:false,
        errorMsg:'',
        obtainedModal:false,
        showPhonePop: false,
        type: '',
        id: '',
        instructions: '',
        successModal: false,
        data: {},
        maxDiscount: 0,
        showShopNum: 2,
        hasReceiptId:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            parentThis:this
        })
        if (options.id) {
            this.setData({
                id: options.id
            })
        }
        if (options.type) {
            this.setData({
                type: options.type
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
    // 获取卡
    getCardDesc() {
        let that = this;
        let id = this.data.id;
        let card=this.data.type == 'card'?true:false;
        app.util.request(that, {
            url: app.util.getUrl('/shares/' + id,{card}),
            method: 'GET',
            header: app.globalData.token
        }, false).then((res) => {
            this.setData({showLoading:false})
            let instructions = '';
            let maxDiscount = 0;
            if(res.result){
                if (res.result.instructions) {
                    instructions = app.formatRichText(res.result.instructions)
                }
                if (res.result.card.orgAmount && res.result.card.limit) {
                    maxDiscount = res.result.card.orgAmount - res.result.card.limit;
                    maxDiscount = Math.round(maxDiscount * 100) / 100
                }
               
            }
            if (res.code == 200) {
            }else if(res.code==405711||res.code==405712|| res.code==405710){
                that.setData({
                    obtainedModal:true,
                    errorMsg:res.message,
                    hasReceiptId:res.result.id
                })
            }else{
                this.setData({
                    errorMsgModal:true,
                    errorMsg:res.message
                })
            }
            
            that.setData({
                data: res.result?res.result:false,
                instructions,
                maxDiscount
            })
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

    // 去加入
    toJoin() {
        wx.showLoading(
            {
                title: '加载中',
                mask: true
            }
        )
        let url = "/shares/" + this.data.data.id;
        let that = this;
        let json = {};
        let card=this.data.type == 'card'?true:false;
        json.card=card;
        app.util.request(that, {
            url: app.util.getUrl(url),
            method: 'POST',
            header: app.globalData.token,
            data: json
        }).then((res) => {
            wx.hideLoading();
            console.log(res)
            if (res.code == 200) {
                let successMsg=''
                if(this.data.type=='card'){
                    successMsg='加入成功'
                }else{
                    successMsg='领取成功。知道了'
                }
                that.setData({
                    successMsg,
                    successModal: true,
                    hasReceiptId:res.result.id
                })
            } else if (res.code == 403060) {
                that.setData({
                    showPhonePop: true
                })
            }  else if (res.code == 405711||res.code == 405712|| res.code==405710) {
                that.setData({
                    obtainedModal:true,
                    errorMsg:res.message,
                    hasReceiptId:res.result.id
                })
            } else{
                that.setData({
                    errorMsgModal:true,
                    errorMsg:res.message
                })
            }
        })
    },
    // 关闭弹窗
    closeSuccess() {
        this.setData({
            successModal:false
        }, () => {
            let id = this.data.hasReceiptId;
            if(this.data.type=='card'){
                 // 加入成功，去卡详情
                    wx.redirectTo({
                        url: '/pages/shareCard/myCardDesc/myCardDesc?id=' + id,
                    })
            }else{
                wx.redirectTo({
                    url: '/pages/shareCard/coupons/coupons?id=' + id,
                })
            }
           
        })
    },
    closeModal(e){
        let name=e.currentTarget.dataset.name;
        console.log(name)
        let obj={};
        obj[name]=false;
        this.setData(obj,()=>{
            // 已经领取过
            if(name=='obtainedModal'){
                wx.redirectTo({
                    url: '/pages/shareCard/myCardDesc/myCardDesc?id=' + this.data.hasReceiptId,
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
            mask: true
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
    makePhoneCall(e) {
        let phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone,
            success: function () {
                console.log('拨打成功')
            },
            fail: function () {
                console.log('拨打失败')
            }
        })
    },
    
})