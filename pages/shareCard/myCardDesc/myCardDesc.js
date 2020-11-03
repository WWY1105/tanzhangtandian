// pages/shareCard/myCardDesc/myCardDesc.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        purchase:'',
        orderId:'',
        id: '',
        cardDesc: {},
        showShopNum:2,
        maxDiscount:0
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
        this.getCardDesc()
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
        let discount=this.data.cardDesc.card.limit;
        let url="/pages/shareCard/joinShare/joinShare?id="+ this.data.id+"&type='card'";
        let title='快领我的共享卡，和我共享全场'+discount+'折！'
        return {
            title: title,
            path:url,
            imageUrl:this.data.cardDesc.picUrl
        }
    },
    // 获取卡列表
    getCardDesc() {
        let that = this;
        let id = this.data.id;
        let orderId = this.data.orderId;
        let url="";
        if(id){
            url='/shares/' + id
        }
        if(orderId){
            url='/shares/order/' + orderId
        }
        app.util.request(that, {
            url: app.util.getUrl(url),
            method: 'GET',
            header: app.globalData.token
        }).then((res) => {
            console.log(res)
            if (res.code == 200) {
                wx.hideLoading()
                let maxDiscount=0;
                if(res.result.card.orgAmount&&res.result.card.limit){
                    maxDiscount=  res.result.card.orgAmount-res.result.card.limit;
                    maxDiscount= Math.round(maxDiscount*100)/100
                }
            
                let purchase=''
                function formatRichText(html) {
                    let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
                       match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
                       match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
                       match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
                       return match;
                    });
                    newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
                       match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/max-width:[^;]+;/gi, 'max-width:100%;');
                       return match;
                    });
                    newContent = newContent.replace(/<br[^>]*\/>/gi, '');
                    newContent = newContent.replace(/em[^>]*\/>/gi, '%');
                    newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;width:auto!important;height:auto;display:block;margin-top:0;margin-bottom:0;"');
                    newContent = newContent.replace(/\<li/gi, '*<li style="list-style-type:none;display:inline-block"');
                    return newContent;
                 }
             
                if (res.result.purchase) {
                    purchase = formatRichText(res.result.purchase)
                }
                that.setData({
                    purchase,
                    maxDiscount,
                    cardDesc: res.result
                })

            }
        })
    },
    // 查看卡详情
    seeCardDetail(){
        let url= '/pages/shareCard/cardDetail/cardDetail?id='+this.data.id
        wx.navigateTo({
          url
        })
    },
    // 查看优惠券
    toCoupon(){
        let url= '/pages/shareCard/coupons/coupons?id='+this.data.id
        wx.navigateTo({
          url
        })
    },

    // 查看所有门店
    showAllShop(){
        let length=this.data.cardDesc.shops.length;
        let showShopNum=this.data.showShopNum;
        if(showShopNum==2){
            showShopNum=length
        }else{
            showShopNum=2
        }
        this.setData({showShopNum})
    },
    // 打电话
    makePhoneCall(e){
        let phone=e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone,
            success:function(){
              console.log('拨打成功')
            },
            fail:function(){
              console.log('拨打失败')
            }
          })
    }
})