const app = getApp()
Page({

   /**
    * 页面的初始数据
    */
   data: {
      parentThis: this,
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
      defaultAddress: null,
      carriageFee: 0
   },
   // 去支付
   toPay() {
      let that = this;
      let url = '/takeouts/order/' + this.data.orderId;
      if (!this.data.defaultAddress || !this.data.defaultAddress.id) {
         wx.showToast({
            title: '请填写收货地址',
            icon: 'none',
            duration: 3000
         })
         return;
      }
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
            app._wxPay(res.result.pay, () => {
               wx.navigateTo({
                  url: '/packageA/pages/onlineOrder/paySuccess/paySuccess',
               })
            })
         } else {
            wx.showToast({
               title: res.message,
               icon: "none",
               duration: 5000
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

      this.setData({
         defaultAddress,
         addressList
      }, () => {
         this.hideModal();
         this.getCarriageFee();
      })
   },
   // 获取运费
   getCarriageFee() {
      let that = this;
      if (this.data.defaultAddress && this.data.defaultAddress.id) {
         let addressId = this.data.defaultAddress.id;
         wx.request({
            url: app.util.getUrl('/takeouts/order/' + this.data.orderId + '/address/' + addressId),
            method: 'GET',
            header: app.globalData.token,
            success: function (res) {
               wx.hideLoading();
               if (res.data.code == 200) {
                  let carriageFee = res.data.result.amount - 0
                  // 加上运费
                  let order = that.data.order;
                  if (order.amount && carriageFee) {
                     order.amount = Number(order.amount) + Number(carriageFee);
                  }
                  that.setData({
                     carriageFee,
                     order
                  })
               } else {
                  wx.showModal({
                     title: '提示',
                     content: '订单超时，请重新下单'
                  })
               }
            }

         })
      }
   },

   // 新建地址
   toNewAddress() {
      wx.navigateTo({
         url: '/packageA/pages/onlineOrder/newAddress/newAddress',
      })
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
         wx.setStorageSync('orderId', options.orderId)
         this.setData({
            orderId: options.orderId,
            parentThis: this
         }, () => {
            that.getOrderDetail()
         })
      } else if (wx.getStorageSync('orderId')) {
         this.setData({
            orderId: wx.getStorageSync('orderId'),
            parentThis: this
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
      this.onLoad()
   },
   againRequest() {
      this.toNewAddress()
   },
   // 获取订单
   getOrderDetail() {
      let that = this;
      wx.request({
         url: app.util.getUrl('/takeouts/order/' + this.data.orderId),
         method: 'GET',
         header: app.globalData.token,
         success: function (res) {
            wx.hideLoading();
            if (res.data.code == 200) {
               // 如果有地址
               let defaultAddress = {};
               if (res.data.result.deliver.address) {
                  let result = res.data.result.deliver;
                  defaultAddress.address = result.address;
                  defaultAddress.id = result.addressId;
                  defaultAddress.nickname = result.nickname;
                  defaultAddress.phone = result.phone;

               }

               that.setData({
                  order: res.data.result,
                  defaultAddress
               }, () => {
                  console.log(that.data.defaultAddress)
                  if (that.data.defaultAddress && that.data.defaultAddress.id) {
                     // 获取运费
                     that.getCarriageFee()
                  }
               })

            } else {
               wx.showModal({
                  title: "提示",
                  content: "订单超时，请重新下单"
               })
            }
         }

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
            if (res.result.total > 0) {
               that.showModal()
            } else {
               that.toNewAddress();
            }
            that.setData({
               addressList: res.result
            })
         } else {
            that.toNewAddress()
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