const app = getApp()
Page({

   /**
    * 页面的初始数据
    */
   data: {
      time: "",
      type: '',
      menus: [],
      total: 0,
      totalPrice: 0,
      addressList: [],
      order: null,
      orderId: ""
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideLoading()
      let that = this;
      if (options.orderId) {
         this.setData({
            orderId: options.orderId
         }, () => {
            that.getOrderDetail()
         })
      }
   },

   // 提交订单
   submit() {

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
   // 获取订单
   getOrderDetail() {
      let that = this;
      app.util.request(that, {
         url: app.util.getUrl('/takeouts/order/' + this.data.orderId),
         method: 'GET',
         header: app.globalData.token
      }).then((res) => {
         wx.hideLoading();
         if (res.code == 200) {
            that.setData({
               order: res.result
            })

         }
      }).catch(() => {
         wx.hideLoading();
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
      let path='';
      if(this.data.order.deliver.type=='1001'){
         path='packageA/pages/onlineOrder/client/confirmOrderTakeout/index?orderId='+this.data.orderId
      }else{
         path='packageA/pages/onlineOrder/client/confirmOrderSelf/index?orderId='+this.data.orderId
      }
      return {
         title:'您的订单',
         path:path
      }
   }
})