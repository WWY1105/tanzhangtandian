// pages/order/cardOrderDetail/cardOrderDetail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        orderDetail: {}
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
        this.getOrderDetail()
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
    getOrderDetail() {
        let that = this;
        let url = '/orders/' + this.data.id;
        app.util.request(that, {
            url: app.util.getUrl(url, {}),
            method: 'GET',
            header: app.globalData.token,
        }).then((res) => {
            wx.hideLoading()
            if (res.code == 200) {
                let orderDetail = res.result;
                that.setData({
                    orderDetail
                })
            }
        })
    },
    refund(){
        let that = this;
        let url = '/refunds/' + this.data.id;
        app.util.request(that, {
            url: app.util.getUrl(url, {}),
            method: 'POST',
            header: app.globalData.token,
        }).then((res) => {
            wx.hideLoading()
            if (res.code == 200) {
               wx.showModal({
                 title:"退款成功",
                 complete:()=>{
                     wx.navigateBack()
                 }
               })
            }
        })
    }
})