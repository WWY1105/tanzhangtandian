// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    userimg: "http://photocdn.sohu.com/20050905/Img226866286.jpg",
    tap: [1, 2, 3, 4, 5],
    arr: []
  },
  toReceive() {
    wx.navigateTo({
      url: '../receive/receive'
    })
  },
  toHome() {
    wx.switchTab({
      url: '../home/home'
    })
  },
  tapimg(e) {
    var key = e.currentTarget.dataset.key
    var name = 'arr['+key+'].swich';
    var name2 = this.data.arr[key].swich;
    this.setData({
      [name]: !name2
    })
    // this.data.arr[key].swith=false;
    console.log(this.data.arr[key])
  },
  preventTouchMove(e) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var arr1 =[];
    for(var i=0; i<this.data.tap.length; i++){
      arr1.push({ 
        'id': this.data.tap[i],
        'swich': true
      })
    }
    this.setData({
      arr: arr1
    })
    console.log(this.data.arr)
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
    return {
      title:'上宾',
      path:'/page/share/share'
    }
  }
})