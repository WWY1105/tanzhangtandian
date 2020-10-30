// pages/shareCard/coupons/coupons.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'',
        coupons:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideLoading()
       if(options.id){
           this.setData({id:options.id})
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
        let discount=this.data.coupons.share.given;
        let url="/pages/shareCard/joinShare/joinShare?id="+ this.data.coupons.share.id;
        let title='快领我的共享卡，和我共享全场'+discount+'折！'
        return {
            title: title,
            path:url,
            imageUrl:this.data.coupons.share.picUrl
        }
    },
    // 获取数据
    getData(){
        let that = this;
        let id = this.data.activityId;
        app.util.request(that, {
            url: app.util.getUrl('/shares/'+this.data.id+'/coupons'),
            method: 'GET',
            header: app.globalData.token
        }).then((res) => {
            console.log(res)
            if (res.code == 200) {
                wx.hideLoading()
                that.setData({
                    coupons: res.result
                })
  
            }
        })
    },
    //去使用
    toUse(e){
        let id=e.currentTarget.dataset.id;
        wx.navigateTo({
          url: '/pages/coupon/index?id='+id,
        })
    } 
})