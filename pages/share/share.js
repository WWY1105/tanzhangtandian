// pages/share/share.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimg: "http://photocdn.sohu.com/20050905/Img226866286.jpg",
    play: 'https://s2.ax1x.com/2019/03/28/Awyc4J.png',
    beijing: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/beijing.png", 'base64'),
    playimg: true,
    intop: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/songni.png", 'base64'),
    text: {},
    mask: false,
    btnshow: false,
    canva: '',
    posts: '',
    time: '',
    timer1: '',
    id: '',
    num: 0

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
      playimg: false
    })
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.play();
  },
  stopplay() {
    this.setData({
      playimg: true
    })
  },
  countdown: function(time) {
    var _self = this
    var leftTime = time - new Date().getTime();
    var d, h, m, s, ms;
    if (leftTime >= 0) {
      d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      h = Math.floor(leftTime / 1000 / 60 / 60);
      m = Math.floor(leftTime / 1000 / 60 % 60);
      s = Math.floor(leftTime / 1000 % 60);
      ms = Math.floor(leftTime % 1000);
      if (ms < 100) {
        ms = "0" + ms;
      }
      if (s < 10) {
        s = "0" + s;
      }
      if (m < 10) {
        m = "0" + m;
      }
      if (h < 10) {
        h = "0" + h;
      }
    } else {
      h = "00"
      m = "00"
      s = "00"
    }
    var filter = h + ":" + m + ":" + s
    return filter
  },
  chanagetext() {
    var that = this
    var len = this.data.posts.posters.length
    if (that.data.num >= len - 1) {
      that.setData({
        num: 0
      })
    } else {
      that.setData({
        num: that.data.num + 1
      })

    }
    that.setData({
      text: {
        content: that.data.posts.posters[that.data.num].content,
        id: that.data.posts.posters[that.data.num].id
      }
    })
  },
  submittext() {
    var that = this
    var json = {
      "posterId": that.data.text.id
    }
    wx.request({
      url: app.util.getUrl('/tasks/task/' + that.data.id + '/invitation'),
      method: 'POST',
      header: app.globalData.token,
      data: json,
      success: function(res) {
        let data = res.data;
        console.log(res)
        if (data.code == 200) {
          that.setData({
            video: data.result
          })
        } else {
          wx.showToast({
            title: data.message,
            duration: 2000
          });
        }
      }
    });
    that.picture();
  },



  picture: function() { //生成图片
    wx.showLoading({
      title: "海报生成中",
      mask: true
    })
    console.log("点击")
    let that = this;

    console.log("画")
    const ctx = wx.createCanvasContext('shareCanvas');

    

    wx.getImageInfo({
      src: that.data.posts.poster.picUrl,
      success: function(res) {
        ctx.drawImage(res.path, 0, 0, 375, 300); //绘制背景图
        console.log('背景图')

        
        ctx.setTextAlign('center'); // 文字居中
        var rect = {
          x: 0,
          y: 200,
          width: 375,
          height: 600
        }
        that.drawRoundedRect(rect, 25, ctx);

        var obj = {
          x: 190,
          y: 310,
          width: 295,
          height: 50,
          line: 2,
          color: '#333',
          size: 18,
          align: 'center',
          baseline: 'middle',
          text: '这家店超赞👍送你【独家探店券】,' + that.data.posts.brand + that.data.posts.shopName,
          bold: true
        }
        that.textWrap(obj, ctx)

        var postertext = {
          str: "这个东西好吃\n快来吃吧\n啊哈哈哈噶色官方",
          x: 190,
          y: 400,
          lineheight: 40,
          color: "#333",
          fontsize: 16
        }
        that.autoTxt(postertext, ctx)



        var arr = postertext.str.split("\n")
        var boxheight = 390 + arr.length * postertext.lineheight + postertext.lineheight

        ctx.beginPath()
        ctx.arc(0, boxheight, 10, 0, 2 * Math.PI)
        ctx.setFillStyle('#000')
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.arc(375, boxheight, 10, 0, 2 * Math.PI)
        ctx.setFillStyle('#000')
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.setFontSize(20)
        ctx.fillText(that.data.posts.brand, 75, 30)
        ctx.closePath()


        ctx.beginPath()
        ctx.setFontSize(16)
        ctx.fillText("长按识别小程序 立即领取福利", 190, boxheight + 110)
        ctx.closePath()

        ctx.beginPath()
        ctx.setFontSize(18);
        ctx.setFillStyle('#333');
        ctx.fillText(that.data.posts.nickname, 120, 245);
        ctx.setFontSize(16);
        ctx.fillText("消费", 290, 244);
        ctx.fillText(that.data.posts.profitEstimation + "元", 330, 244);
        ctx.fill();
        ctx.closePath()

        ctx.beginPath()
        ctx.setLineWidth(10)
        ctx.moveTo(20, 310)
        ctx.lineTo(20, 280)
        ctx.lineTo(40, 280)
        ctx.setFillStyle('red');
        ctx.stroke();
        ctx.closePath()

        ctx.beginPath()
        ctx.setLineWidth(10)
        ctx.moveTo(355, 360)
        ctx.lineTo(355, 390)
        ctx.lineTo(335, 390)
        ctx.setFillStyle('#D7D8DA');
        ctx.stroke();
        ctx.closePath()

        ctx.beginPath()
        ctx.setLineWidth(2)
        ctx.setFillStyle('#333');
        ctx.setLineDash([2, 10], 3)
        ctx.moveTo(0, boxheight)
        ctx.lineTo(375, boxheight)
        ctx.stroke();
        ctx.closePath()

        wx.getImageInfo({
          src: that.data.posts.avatarUrl,
          success: function (cb) {
            console.log('头像')
            ctx.drawImage(cb.path, 160, boxheight + 30, 50, 50);
            that.drawUserImg(cb.path, 20, 220, 40, 40, ctx);
            setTimeout(function () {
              ctx.beginPath()
              ctx.setShadow(1, 1, 1, "#333")
              ctx.setFillStyle('#fff');
              ctx.setFontSize(20); // 文字字号：22px
              ctx.fillText(that.data.posts.brand, 75, 30); //开始绘制文本的 x/y 坐标位置（相对于画布）
              ctx.setFontSize(15);
              ctx.fillText(that.data.posts.consume.address, 73, 50);
              ctx.setTextAlign('left')
              ctx.fill();
              ctx.closePath()
              console.log('canvas')
              ctx.draw(false, that.drawPicture(boxheight)); //draw()的回调函数 
            }, 300)
          }
        })


        
      }
    })

    // console.log(res.path);

  },
  point: function(x, y) {
    return {
      x: x,
      y: y
    };
  },
  drawUserImg: function(img, x, y, width, height, ctx) {
    ctx.clearRect(x, y, width, height);
    ctx.setFillStyle('#fff')
    //开始路径画圆,剪切处理
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + width / 2, y + width / 2, width / 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.clip(); //剪切路径
    ctx.drawImage(img, x, y, width, height);
    //恢复状态
    ctx.restore();

  },
  drawRoundedRect: function(rect, r, ctx) {
    var ptA = this.point(rect.x + r, rect.y);
    var ptB = this.point(rect.x + rect.width, rect.y);
    var ptC = this.point(rect.x + rect.width, rect.y + rect.height);
    var ptD = this.point(rect.x, rect.y + rect.height);
    var ptE = this.point(rect.x, rect.y);

    ctx.beginPath();

    ctx.moveTo(ptA.x, ptA.y);
    ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
    ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
    ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
    ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);
    ctx.setFillStyle('#fff')

    ctx.fill();
    ctx.closePath()

  },
  textWrap: function(obj, ctx) {
    console.log('文本换行')
    var td = Math.ceil(obj.width / (obj.size));
    var tr = Math.ceil(obj.text.length / td);
    for (var i = 0; i < tr; i++) {
      var txt = {
        x: obj.x,
        y: obj.y + (i * obj.height),
        color: obj.color,
        size: obj.size,
        align: obj.align,
        baseline: obj.baseline,
        text: obj.text.substring(i * td, (i + 1) * td),
        bold: obj.bold
      };
      if (i < obj.line) {
        // if (i == obj.line - 1) {
        //   txt.text = txt.text.substring(0, txt.text.length - 3) + '......';
        // }
        this.drawText(txt, ctx);
      }
    }
  },
  drawText: function(obj, ctx) {
    console.log('渲染文字')
    ctx.save();
    ctx.setFillStyle(obj.color);
    ctx.setFontSize(obj.size);
    ctx.setTextAlign(obj.align);
    ctx.setTextBaseline(obj.baseline);
    if (obj.bold) {
      console.log('字体加粗')
      ctx.fillText(obj.text, obj.x, obj.y - 0.5);
      ctx.fillText(obj.text, obj.x - 0.5, obj.y);
    }
    ctx.fillText(obj.text, obj.x, obj.y);
    if (obj.bold) {
      ctx.fillText(obj.text, obj.x, obj.y + 0.5);
      ctx.fillText(obj.text, obj.x + 0.5, obj.y);
    }
    ctx.restore();
  },
  autoTxt: function(postertext, ctx) {
    console.log("进入autoTxt")
    var arr = postertext.str.split("\n")
    ctx.beginPath()
    ctx.setFillStyle(postertext.color);
    ctx.setFontSize(postertext.fontsize);
    var top = postertext.y
    for (var i = 0; i < arr.length; i++) {
      console.log("autoTxt循环")
      top = top + postertext.lineheight
      ctx.fillText(arr[i], postertext.x, top);
    }
    ctx.fill();
    ctx.closePath()
  },
  drawPicture: function(boxheight) { //生成图片
    console.log("生成")
    var that = this;
    setTimeout(function() {
      wx.canvasToTempFilePath({ //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
        x: 0,
        y: 0,
        width: 375,
        height: boxheight + 160,
        destWidth: 1080, //输出的图片的宽度（写成width的两倍，生成的图片则更清晰）
        destHeight: (boxheight + 160) * 3,
        fileType: 'jpg',
        quality: 1,
        canvasId: 'shareCanvas',
        success: function(res) {
          console.log(res);         
          that.setData({
            canva: res.tempFilePath
          })
          wx.hideLoading();
          // that.draw_uploadFile(res);
        },
        fail: function(res){
          console.log(res)
          wx.hideLoading();
        }
      })
    }, 300)
  },
  saveImg: function(){
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.canva,
      success(res) { 
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  close: function(){
    this.setData({
      canva:false
    })
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
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })

    var that = this
    this.setData({
      id: options.id,
      userimg: app.globalData.userInfo.avatarUrl
    })
    var json = {
      taskId: options.id
    }

    wx.request({
      url: app.util.getUrl('/tasks/task/' + options.id + '/ongoing', json),
      method: 'GET',
      header: app.globalData.token,
      success: function(res) {
        let data = res.data;
        console.log(res)
        if (data.code == 200) {
          that.setData({
            posts: data.result
          })
          if (data.result.posters) {
            that.setData({
              text: {
                content: data.result.posters[0].content,
                id: data.result.posters[0].id
              }
            })
          }
          if (data.result.poster) {
            that.setData({
              text: {
                content: data.result.poster.content,
                id: data.result.poster.id
              }
            })
          }
          var time = new Date(that.data.posts.expiredTime + '').getTime()
          var doc = 'posts.time'
          that.setData({
            timer1: setInterval(function() {
              that.setData({
                [doc]: that.countdown(time)
              })
            }, 1000)
          })
          var jsons = {
            id: that.data.posts.video.id
          }
          wx.request({
            url: app.util.getUrl('/videos/' + jsons.id, jsons),
            method: 'GET',
            header: app.globalData.token,
            success: function(res) {
              let data = res.data;
              console.log(res)
              if (data.code == 200) {
                that.setData({
                  video: data.result
                })
                console.log(that.data.video)
              } else {
                wx.showToast({
                  title: data.message,
                  duration: 2000
                });
              }
            }
          });
          console.log(that.data.posts)
          wx.hideLoading();

        } else {
          wx.showToast({
            title: data.message,
            duration: 2000
          });
        }
      }
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '这家店超赞👍送你【独家探店券】,' + this.data.posts.brand + this.data.posts.shopName,
      path: '/pages/receive/receive?id=' + this.data.id,
      imageUrl: this.data.posts.video.coverPicUrl
    }
  }
})