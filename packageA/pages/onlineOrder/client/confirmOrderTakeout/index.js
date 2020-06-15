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
      orderId: "",
      hideModal: true, //模态框的状态  true-隐藏  false-显示
      animationData: {}, //
      defaultAddress: null
   },
   // 去支付
   toPay() {
      let that = this;
      let url = '/takeouts/order/' + this.data.orderId;
      let data = {
         addressId: this.data.defaultAddress.id
      }
      app.util.request(that, {
         url: app.util.getUrl(url),
         method: 'POST',
         header: app.globalData.token,
         data: data
      }).then((res) => {
         wx.hideLoading()
         if (res.code == 200) {
            wx.navigateTo({
               url: '/packageA/pages/onlineOrder/paySuccess/paySuccess',
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
   // 新增地址
   newAddress() {
      wx.navigateTo({
         url: "/packageA/pages/onlineOrder/newAddress/newAddress"
      })
   },
   // 编辑地址
   editAddress(e) {
      let editObj = JSON.stringify(e.currentTarget.dataset.item)
      wx.navigateTo({
         url: "/packageA/pages/onlineOrder/newAddress/newAddress?editObj=" + editObj
      })
   },
   changeDefaultAddress(e) {
      let defaultAddress = null;
      let addressList = this.data.addressList;
      let index = JSON.stringify(e.currentTarget.dataset.index)
      addressList.items.map((i) => {
         i.defaultAddress = false;
      })
      addressList.items[index].defaultAddress = true;
      defaultAddress = addressList.items[index];
      console.log(defaultAddress)
      this.setData({
         defaultAddress,
         addressList
      }, () => {
         this.hideModal()
      })
   },
   toNewAddress() {
      wx.navigateTo({
         url: '/packageA/pages/onlineOrder/newAddress/newAddress',
      })
   },
   toAddAddress() {
      let that = this;
      if (this.data.addressList.length > 0) {
         this.showModal()
      } else {
         this.toNewAddress()
      }
   },
   // 显示遮罩层
   showModal: function () {
      var that = this;
      that.setData({
         hideModal: false
      })
      var animation = wx.createAnimation({
         duration: 600, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
         timingFunction: 'ease', //动画的效果 默认值是linear
      })
      this.animation = animation
      setTimeout(function () {
         that.fadeIn(); //调用显示动画
      }, 200)
   },

   // 隐藏遮罩层
   hideModal: function () {
      var that = this;
      var animation = wx.createAnimation({
         duration: 800, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
         timingFunction: 'ease', //动画的效果 默认值是linear
      })
      this.animation = animation
      that.fadeDown(); //调用隐藏动画   
      setTimeout(function () {
         that.setData({
            hideModal: true
         })
      }, 720) //先执行下滑动画，再隐藏模块

   },

   //动画集
   fadeIn: function () {
      this.animation.translateY(0).step()
      this.setData({
         animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
      })
   },
   fadeDown: function () {
      this.animation.translateY(600).step()
      this.setData({
         animationData: this.animation.export(),
      })
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

      this.getAddress();

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
   // 查询地址
   getAddress() {
      let that = this;
      app.util.request(that, {
         url: app.util.getUrl('/user/address'),
         method: 'GET',
         header: app.globalData.token
      }).then((res) => {
         wx.hideLoading();
         if (res.code == 200) {
            let defaultAddress = null;
            if (res.result.total > 0) {
               res.result.items.map((item) => {
                  if (item.defaultAddress) {
                     defaultAddress = item
                  }
               })
            }
            that.setData({
               addressList: res.result,
               defaultAddress
            })
            console.log(this.data.defaultAddress)

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

   }
})