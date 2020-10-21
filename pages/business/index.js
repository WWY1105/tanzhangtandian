// pages/business/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        t: '',
        id: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideLoading();
        console.log(options)
        if (options.t) {
            this.setData({
                t: options.t
            })
        }
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

    },
    getData() {
        let that = this;
        let url = '';
        console.log(this.data.t)
        if (this.data.t == 'p') {
            url = '/business/promotes/' + this.data.id
        }
        if (this.data.t == 'd') {
            url = '/business/dynamics/' + this.data.id
        }
        app.util.request(that, {
            url: app.util.getUrl(url),
            method: 'GET',
            header: app.globalData.token
        }).then((res) => {
            wx.hideLoading();
            if (res.code == 200) {
                if (res.result && res.result.business) {
                    switch (res.result.business) {
                        case '1010':
                            wx.redirectTo({
                                url: '/pages/shareCard/buyCard/buyCard?activityId=' + res.result.activityId + '&shopId=' + res.result.shopId,
                            })
                    }
                }


            }
        })
    }
})