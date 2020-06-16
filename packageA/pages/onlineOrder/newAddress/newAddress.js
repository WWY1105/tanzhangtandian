// packageA/pages/onlineOrder/newAddress.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        latitude: 0,
        longitude: 0,
        address: "",
        addressDetail: "",
        nickname: "",
        phone: "",
        defaultAddress:false,
        editObj:null
    },
    nicknameInput(e) {
        let nickname = e.detail.value;
        this.setData({
            nickname
        })
    },
    addressDetailInput(e) {
        let addressDetail = e.detail.value;
        this.setData({
            addressDetail
        })
    },
    phoneInput(e) {
        let phone = e.detail.value;
        this.setData({
            phone
        })
    },
    // 提交信息
    submit() {
        let that = this;
        let data = {
            latitude:this.data.latitude,
            longitude:this.data.longitude
        };
        if (!this.data.address) {
            wx.showToast({
                title: '提示',
                content: '请输入收货地址',
                icon: 'none'
            })
        } else {
            data.address = this.data.address;
        }
        if (!this.data.addressDetail) {
            wx.showToast({
                title: '提示',
                content: '请输入门牌号',
                icon: 'none'
            })
        } else {
            data.addressDetail = this.data.addressDetail;
        }
        if (!this.data.nickname) {
            wx.showToast({
                title: '提示',
                content: '请输入联系人姓名',
                icon: 'none'
            })
        } else {
            data.nickname = this.data.nickname;
        }
        if (!this.data.phone) {
            wx.showToast({
                title: '提示',
                content: '请输入手机号',
                icon: 'none'
            })
        } else {
            data.phone = this.data.phone;
        }
        // 修改地址 
        if(this.data.editObj){
            app.util.request(that, {
                url: app.util.getUrl('/user/address/'+this.data.editObj.id),
                method: 'PUT',
                header: app.globalData.token,
                data: data
            }).then((res) => {
                wx.hideLoading()
                if (res.code == 200) {
                    wx.navigateTo({
                      url: '/packageA/pages/onlineOrder/client/confirmOrderTakeout/index',
                    })
                } else {
                    wx.showToast({
                        title: res.message,
                        icon: "none",
                        duration: 2000
                    })
                }
            })
        }else{
            //新增地址
            app.util.request(that, {
                url: app.util.getUrl('/user/address'),
                method: 'POST',
                header: app.globalData.token,
                data: data
            }).then((res) => {
                wx.hideLoading()
                if (res.code == 200) {
                    wx.navigateTo({
                      url: '/packageA/pages/onlineOrder/client/confirmOrderTakeout/index',
                    })
                } else {
                    wx.showToast({
                        title: res.message,
                        icon: "none",
                        duration: 2000
                    })
                }
            })
        }
       
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideLoading()
        if(options.editObj){
            let editObj=JSON.parse(options.editObj)
            this.setData({
                editObj:editObj,
                address:editObj.address,
                addressDetail:editObj.addressDetail,
                nickname:editObj.nickname,
                phone:editObj.phone,
                defaultAddress:editObj.defaultAddress
            })
            console.log(options.editObj)
        }
    },
//    设置默认地址
switch2Change(e){
    let url="/user/address/"+this.data.editObj.id+"/default";
    let that=this;
    let data={};
    app.util.request(that, {
        url: app.util.getUrl(url),
        method: 'POST',
        header: app.globalData.token,
        data: data
     }).then((res) => {
        wx.hideLoading()
        if (res.code == 200) {
           wx.navigateTo({
               url: '/packageA/pages/onlineOrder/client/confirmOrderTakeout/index',
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
// switch2Change(e){
//     console.log(e.detail.value)
// },
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
        let that = this;
        app.locationCheck(() => {
            let latitude = wx.getStorageSync('latitude');
            let longitude = wx.getStorageSync('longitude');
            this.setData({
                latitude,
                longitude
            })
            //选择地址
            wx.chooseLocation({
                latitude,
                longitude,
                success: function (res) {
                    let address = res.address + res.name;
                    that.setData({
                        address
                    })
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