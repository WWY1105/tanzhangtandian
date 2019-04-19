// pages/share/share.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    userimg: "http://photocdn.sohu.com/20050905/Img226866286.jpg",
    play: 'https://s2.ax1x.com/2019/03/28/Awyc4J.png',
    beijing: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/beijing.png", 'base64'),
    playimg:true,
    intop: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/songni.png", 'base64'),
    text: '不得不说，这是我目前吃到过的最好吃的了，真是太棒了',
    mask:false,
    btnshow:false,
    canva:''
  },
  toDetail() {
    wx.navigateTo({
      url: '../detail/detail'
    })
  },
  toHome() {
    wx.switchTab({
      url: '../home/home'
    })
  },
  preventTouchMove(e) {

  },
  play() {
    this.setData({
      playimg:false
    })
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.play();
  },
  stopplay(){
    this.setData({
      playimg: true
    })
  },





  picture: function () {  //生成图片
    console.log("点击")
    let that = this;
    let p1 = new Promise(function (resolve, reject) {
      // wx.getImageInfo({
      //   src: that.data.beijing,
      //   success(res) {
      //     console.log(res)
      //     resolve(res);
      //   }
      // })
      resolve()
    }).then(res => {
      console.log("画")
      const ctx = wx.createCanvasContext('shareCanvas');
      ctx.drawImage(that.data.beijing, 0, 0, 375, 300);    //绘制背景图
      //ctx.setTextAlign('center')    // 文字居中
      ctx.setFillStyle('#000000')  // 文字颜色：黑色
      ctx.setFontSize(20)         // 文字字号：22px
      ctx.fillText("文本内容", 20, 70) //开始绘制文本的 x/y 坐标位置（相对于画布） 
      ctx.stroke();//stroke() 方法会实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色
      ctx.draw(false, that.drawPicture());//draw()的回调函数 
      // console.log(res.path);
    })
  },
  drawPicture: function () { //生成图片
    console.log("生成")
    var that = this;
    setTimeout(function () {
      wx.canvasToTempFilePath({ //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
        x: 0,
        y: 0,
        width: 375,
        height: 300,
        destWidth: 750,  //输出的图片的宽度（写成width的两倍，生成的图片则更清晰）
        destHeight: 600,
        canvasId: 'shareCanvas',
        success: function (res) {
          console.log(res);
          that.setData({
            canva: res.tempFilePath
          })
          // that.draw_uploadFile(res);
        },
      })
    }, 300)
  },
  // draw_uploadFile: function (r) { //wx.uploadFile 将本地资源上传到开发者服务器
  //   let that = this;
  //   wx.uploadFile({
  //     url: 图片上传接口, //线上接口
  //     filePath: r.tempFilePath,
  //     name: 'imgFile',
  //     success: function (res) {
  //       console.log(res);
  //       if (res.statusCode == 200) {
  //         res.data = JSON.parse(res.data);
  //         let imgsrc = res.data.data.src;
  //         that.setData({
  //           imgPath: imgsrc
  //         });
  //       } else {
  //         console.log('失败')
  //       }
  //     },
  //   })
  // },









  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
      path:'/pages/receive/receive'
    }
  }
})