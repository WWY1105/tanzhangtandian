// pages/shareCard/myCardList/myCardList.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardList: [],
        parentThis: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({parentThis:this})
        this.getCardList()
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
    // 获取卡列表
    getCardList() {
        let that = this;
        app.util.request(that, {
            url: app.util.getUrl('/benefits/cards'),
            method: 'GET',
            header: app.globalData.token
        }).then((res) => {
            console.log(res)
            if (res.code == 200) {
                wx.hideLoading()
                that.setData({
                    cardList: res.result
                })

            }
        })
    },
    // 查看卡详情
    toCardDetail(e) {
        let id = e.currentTarget.dataset.id;
       wx.navigateTo({
         url: '/pages/shareCard/myCardDesc/myCardDesc?id='+id,
       })
    },
    againRequest(){
        this.getCardList()
    },
})