// pages/shareCard/buySuccess/buySuccess.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // ---------header
        nvabarData: {
            height: app.globalData.height * 2 + 28,
            title: '购卡成功', //导航栏 中间的标题
        },

        // ---------header
        mode: '2000', //同意
        orderId: false,
        showLoading: true,
        order: false,
        cardShow: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.orderId) {
            this.setData({
                orderId: options.orderId
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
        this.getData()
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
        console.log(this.data.order)
        let discount = this.data.order.card.limit||'';
        let that = this;
        let url = "/pages/shareCard/joinShare/joinShare?id=" + this.data.order.id + "&type=card";
        let title = '快领我的共享卡，和我共享全场' + discount + '折！'
        return {
            title: title,
            path: url,
            imageUrl: this.data.order.sharePicUrl,
            success: function (res) {
                console.log('成功')
                // 转发成功之后的回调
                if (res.errMsg == 'shareAppMessage:ok') {
                    that.setData({cardShow:false})
                }
            },
        }
    },
    hideModal() {
        this.setData({
            cardShow: false
        })
    },
    // 点击切换mode
    changeMode() {
        let mode = this.data.mode;
        let that = this;
        mode = mode == '1000' ? '2000' : '1000';
        console.log()
        let url = '/shares/' + that.data.order.id + '/mode';
        this.setData({
            mode
        }, () => {
            let data = {
                mode
            };
            app.util.request(that, {
                url: app.util.getUrl(url),
                method: 'POST',
                header: app.globalData.token,
                data: data
            }).then((res) => {
                if (res.code == 200) {
                
                } else {
                    wx.showToast({
                        title: res.message,
                        icon: "none",
                        duration: 2000
                    })
                }
            })
        });
    },
    // 查看我的卡
    seeMyCard() {
        wx.redirectTo({
            url: '/pages/shareCard/myCardDesc/myCardDesc?orderId=' + this.data.orderId
        })
    },
    // 获取数据
    getData() {
        let that = this;
        let url = '/shares/order/' + this.data.orderId;
        let order;
        app.util.request(that, {
            url: app.util.getUrl(url, {}),
            method: 'GET',
            header: app.globalData.token
        }, false).then((res) => {
            if (res.code == 200) {
                this.setData({
                    showLoading: false,
                    order: res.result
                })
            }
        })

    }
})