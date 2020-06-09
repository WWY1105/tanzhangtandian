// packageA/pages/onlineOrder/newAddress.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fullAddress: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideLoading()
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
        app.locationCheck();
        wx.hideLoading();
    },
    toGetAddress() {
        let that=this;
        app.locationCheck(() => {
            let latitude = wx.getStorageSync('latitude');
            let longitude = wx.getStorageSync('longitude');
            //选择地址
            wx.chooseLocation({
                latitude,
                longitude,
                success: function (res) {
                    let fullAddress=res.address+res.name;
                    that.setData({fullAddress})
                },
            })
        })

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

    }
})