const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    download: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/download.png", 'base64'),
    weixin: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/weixin.png", 'base64'),
    timebg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/timebg.png", 'base64'),
    sharebg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/sharebg.png", 'base64'),



    text: {},
    mask: false,
    btnshow: false,
    canva: '',
    posts: '',
    time: '',
    timer1: '',
    id: '',
    num: 0,
    canvasBox: true,
    scroll_top: false,
    init: true,
    groupBox:false,
    rulepop:false,
    shopinfo:false

  },

  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      id: options.id
    })
    this.getdata();
    wx.request({
      url: app.util.getUrl('/tasks/finished'),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          that.setData({
            swiper: data.result
          })
        }
      }
    })
    
  },
  //转发
  onShareAppMessage: function () {
    var that = this
    if (that.data.posts.mode == '1000') {
      var shareText = '这家店老板是我朋友，快来领取超值优惠券啦！点击赚钱！'
    } else if (that.data.posts.mode == '1002' && that.data.posts.state != '1001') {
      var shareText = '这家店老板真的撒钱啦！点击跟我一起分' + that.data.posts.profitEstimation + '元现金！'
    } else {
      var shareText = '这家店老板真的撒钱啦！我刚刚分到现金，点击赚钱！'
    }
    return {
      title: shareText + this.data.posts.shop.brandName + this.data.posts.shop.name,
      path: '/pages/receive/receive?id=' + this.data.id,
      imageUrl: this.data.posts.sharePicUrl
    }
  },
  toshopDetail() {
    wx.navigateTo({
      url: '../shopDetail/index?id=' + this.data.id
    })
  },
  //获取页面数据
  getdata(canvas) {
    var that = this;
    var json = {
      taskId: this.data.id
    }

    wx.request({
      url: app.util.getUrl('/tasks/task/' + this.data.id, json),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        console.log(res)
        if (data.code == 200) {
          that.setData({
            posts: data.result
          })
          if (data.result.canChooseMode && data.result.state == '1000') {
            that.setData({
              canvasBox: true,
              groupBox: true
            })
          }
          //判断背书
          if (data.result.posters) {
            that.setData({
              text: {
                content: data.result.posters[0].content.replace(/\\n/g, "\n"),
                id: data.result.posters[0].id
              }
            })
          } else if (data.result.poster) {
            that.setData({
              text: {
                content: data.result.poster.content.replace(/\\n/g, "\n"),
                id: data.result.poster.id
              }
            })
          } else {
            that.setData({
              text: {
                content: '',
                id: ''
              }
            })
          }

          //写入倒计时
          var time = new Date(that.data.posts.expiredTime + '').getTime()
          var doc = 'posts.time'
          that.setData({
            timer1: setInterval(function () {
              that.setData({
                [doc]: that.countdown(time)
              })
            }, 1000)
          })
          if (data.result.video && data.result.video.playUrl){
            that.setData({
              video: data.result.video.playUrl,
              videoheight: data.result.video.height * 1 > data.result.video.width * 1 ? "height:650rpx;" : "height:422rpx;"
            })
          }else{
            var jsons = {
              id: that.data.id
            }
            wx.request({
              url: app.util.getUrl('/videos/' + jsons.id, jsons),
              method: 'GET',
              header: app.globalData.token,
              success: function (res) {
                let data = res.data;
                console.log(res)
                if (data.code == 200) {
                  that.setData({
                    video: data.result.url,
                    videoheight: data.result.height * 1 > data.result.width * 1 ? "height:650rpx;" : "height:422rpx;"
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
          }

          if(canvas){
            that.picture();
          }
          
          console.log(that.data.posts)


        } else if (data.code == 403000) {
          wx.removeStorageSync('token')
        } else {
          wx.showToast({
            title: data.message,
            duration: 2000
          });
        }

        let inittimer = setTimeout(function () {
          wx.hideLoading();
          that.setData({
            init: false
          })
          clearTimeout(inittimer);
        }, 1000)
      }
    });
  },
  openrule() {
    this.setData({
      rulepop: true
    })
  },
  openshopinfo() {
    this.setData({
      shopinfo: true
    })
  },
  closePop() {
    this.setData({
      shopinfo: false,
      rulepop: false
    })
  },
  //倒计时
  countdown: function (time) {
    var that = this
    var leftTime = time - new Date().getTime();
    var d, h, m, s, ms;
    var filter = {}
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
      filter.h = "00"
      filter.m = "00"
      filter.s = "00"
      clearInterval(that.data.timer1)
    }
    filter.h = h
    filter.m = m
    filter.s = s
    return filter
  },
  makePhone() {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.posts.shop.tel,
      fail: function (res) {
        console.log(res)
      }
    })
  },
  toFriend() {
    wx.navigateTo({
      url: '../friend/index?id=' + this.data.id
    })
  },
  toMap() {
    var that = this
    wx.openLocation({
      latitude: that.data.posts.shop.latitude,
      longitude: that.data.posts.shop.longitude,
      scale: 18,
      name: that.data.posts.shop.brand + '(' + that.data.posts.shop.shopName + ')',
      address: that.data.posts.shop.brand + '(' + that.data.posts.shop.shopName + ')'
    })
  },
  //换背书
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
        content: that.data.posts.posters[that.data.num].content.replace(/\\n/g, "\n"),
        id: that.data.posts.posters[that.data.num].id
      }
    })
  },
  //提交背书\模式
  submittext(e) {
    wx.showLoading({
      title: "加载中"
    })
    var that = this
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    var json = {
      "posterId": that.data.text.id,
      "formId": e.detail.formId,
      "mode": e.detail.target.dataset.mode
    }
    console.log(json)
    
    wx.request({
      url: app.util.getUrl('/tasks/task/' + that.data.id + '/invitation'),
      method: 'POST',
      header: app.globalData.token,
      data: json,
      success: function (res) {
        let data = res.data;

        console.log("res")
        console.log(res)
        that.setData({
          canvasBox: true,
          groupBox: false,
          canvamodel: true
        })
        that.getdata(true)
        
      }
    });
    console.log(e)
  },
  //提交formid
  submitformid: function (e) {
    var formId = { "formId": e.detail.formId }
    console.log(e)
    console.log("调用id=  " + e.detail.formId)
    wx.request({
      url: app.util.getUrl('/notices'),
      method: 'POST',
      header: app.globalData.token,
      data: formId,
      success: function (res) {
        let data = res.data;
        console.log("res")
        console.log(res)
        if (data.code == 200) {
          console.log("调用成功id=  " + e.detail.formId)
        }
      }
    });
  },
  openModeBox: function() {
    var that = this
    if (that.data.posts.canChooseMode) {
      that.setData({
        canvasBox: true,
        groupBox: true
      })
    } else {
      that.setData({
        canvasBox: true,
        canvamodel: true
      })
      if (!that.data.canva){
        that.picture();
      }
    }
  },
  //生成海报
  picture2: function () {
    wx.showLoading({
      title: "海报生成中"
    })
    console.log("点击")
    var that = this;

    console.log("画")
    const ctx = wx.createCanvasContext('shareCanvas');
    var pic;
    if (that.data.posts.poster) {
      pic = that.data.posts.poster
    } else {
      pic = that.data.posts.posters[that.data.num]
    }

    wx.getImageInfo({
      src: pic.picUrl,
      success: function (res) {
        ctx.drawImage(res.path, 0, 0, 375, 300); //绘制背景图
        console.log('背景图')


        ctx.setTextAlign('center'); // 文字居中
        var rect = {
          x: 0,
          y: 200,
          width: 375,
          height: 1000
        }
        that.drawRoundedRect(rect, 25, ctx);

        var obj = {
          x: 180,
          y: 300,
          width: 305,
          height: 50,
          line: 2,
          color: '#333',
          size: 18,
          align: 'center',
          baseline: 'middle',
          text: that.data.posts.mode == '1000' ? ' 这家店超赞👍送你【独家探店券】' : '这家店超赞👍邀你瓜分【现金红包】',
          bold: true
        }
        that.textWrap(obj, ctx)

        var postertext = {
          str: pic.content,
          x: 190,
          y: 340,
          lineheight: 40,
          color: "#333",
          fontsize: 16
        }
        if (pic.content) {
          that.autoTxt(postertext, ctx)

        }

        var arr = postertext.str.split("\\n")
        var boxheight = 350 + arr.length * 32 + postertext.lineheight

        ctx.beginPath()
        ctx.setFontSize(20)
        ctx.fillText(that.data.posts.brand, 75, 30)
        ctx.closePath()

        ctx.beginPath()
        ctx.setFontSize(18);
        ctx.setFillStyle('#333');
        if (that.data.posts.nickname) {
          ctx.fillText(that.data.posts.nickname, 110, 245);
        }
        ctx.setFontSize(16);
        ctx.fillText("消费", 290, 244);
        ctx.fillText(that.data.posts.consume.amount + "元", 330, 244);
        ctx.closePath()
        ctx.fill();


        ctx.beginPath()
        ctx.setLineWidth(2)
        ctx.setFillStyle('#333');
        ctx.setLineDash([2, 10], 3)
        ctx.moveTo(0, boxheight)
        ctx.lineTo(375, boxheight)
        ctx.closePath()
        ctx.stroke();

        ctx.beginPath()
        ctx.arc(0, boxheight, 10, 0, 2 * Math.PI)
        ctx.setFillStyle('#000')
        ctx.closePath()
        ctx.fill()


        ctx.beginPath()
        ctx.arc(375, boxheight, 10, 0, 2 * Math.PI)
        ctx.setFillStyle('#000')
        ctx.closePath()
        ctx.fill()


        ctx.beginPath()
        ctx.setFontSize(16)
        ctx.fillText("长按识别小程序 立即领取福利", 190, boxheight + 130)
        ctx.closePath()
        ctx.fill();
        wx.showLoading({
          title: "海报生成中"
        })
        if (that.data.posts.avatarUrl) {
          wx.getImageInfo({
            src: that.data.posts.avatarUrl,
            success: function (cb) {
              console.log('头像')
              wx.getImageInfo({
                src: that.data.posts.qrCodeUrl ? that.data.posts.qrCodeUrl : that.data.posts.avatarUrl,
                success: function (result) {
                  console.log("cb")
                  ctx.drawImage(result.path, 135, boxheight + 10, 100, 100);
                  that.drawUserImg(cb.path, 20, 220, 40, 40, ctx);
                  var timer = setTimeout(function () {
                    ctx.beginPath()
                    
                    ctx.setFillStyle('#fff');
                    ctx.setTextAlign('left')
                    ctx.setShadow(1, 1, 1, "#333")
                    ctx.setFontSize(20); // 文字字号：22px
                    ctx.fillText(that.data.posts.brand, 3, 30); //开始绘制文本的 x/y 坐标位置（相对于画布）
                    ctx.setFontSize(15);
                    ctx.setShadow(1, 1, 1, "#333")
                    ctx.fillText(that.data.posts.consume.address, 3, 50);
                    
                    
                    ctx.closePath()
                    ctx.fill();

                    console.log('canvas')
                    ctx.draw(false, that.drawPicture(boxheight)); //draw()的回调函数 
                    clearTimeout(timer)

                  }, 800)
                },
                fail: function (cb) {
                  wx.hideLoading();
                  console.log(that.data.posts.qrCodeUrl)
                }
              })

            },
            fail: function (cb) {
              wx.hideLoading();
              console.log(cb)
            }
          })
        } else {
          var timer = setTimeout(function () {
            ctx.beginPath()
            ctx.setShadow(1, 1, 1, "#333")
            ctx.setFillStyle('#fff');
            ctx.setFontSize(20); // 文字字号：22px
            ctx.fillText(that.data.posts.brand, 75, 30); //开始绘制文本的 x/y 坐标位置（相对于画布）
            ctx.setFontSize(15);
            ctx.setShadow(1, 1, 1, "#333")
            ctx.fillText(that.data.posts.consume.address, 73, 50);
            ctx.setTextAlign('left')
            ctx.closePath()
            ctx.fill();
            console.log('canvas')
            ctx.draw(false, that.drawPicture(boxheight)); //draw()的回调函数 
            clearTimeout(timer)
          }, 800)
        }







      }
    })

  },

  picture: function () {
    wx.showLoading({
      title: "海报生成中"
    })
    console.log("点击")
    var that = this;

    console.log("画")
    const ctx = wx.createCanvasContext('shareCanvas');
    var pic;
    if (that.data.posts.poster) {
      pic = that.data.posts.poster
    } else {
      pic = that.data.posts.posters[that.data.num]
    }

    wx.getImageInfo({
      src: pic.picUrl,
      success: function (res) {
        ctx.drawImage(res.path, 0, 0, 600, 1000); //绘制背景图
        console.log('背景图')


        ctx.setTextAlign('center'); // 文字居中

        var obj = {
          x: 300,
          y: 124.5,
          width: 600,
          height: 100,
          line: 1,
          color: '#333',
          size: 45,
          align: 'center',
          baseline: 'middle',
          text: that.data.posts.mode == '1000' ? '邀你一起拆探店红包' : '邀你组团分现金红包',
          bold: true
        }
        that.textWrap(obj, ctx)

        var obj2 = {
          x: 300,
          y: 200,
          width: 600,
          height: 100,
          line: 1,
          color: '#333',
          size: 75,
          align: 'center',
          baseline: 'middle',
          text: that.data.posts.mode == '1000' ? '为我助力!' : '一起来瓜分!',
          bold: true
        }
        that.textWrap(obj2, ctx)
        if (that.data.posts.nickname) {
          ctx.setFontSize(27);
          ctx.fillText(that.data.posts.nickname, 152, 56);
        }
      
        if (that.data.posts.avatarUrl) {
          wx.getImageInfo({
            src: that.data.posts.avatarUrl,
            success: function (cb) {
              console.log('头像')
              wx.getImageInfo({
                src: that.data.posts.qrCodeUrl ? that.data.posts.qrCodeUrl : that.data.posts.avatarUrl,
                success: function (result) {
                  console.log("cb")
                  ctx.drawImage(result.path, 387, 734.5, 133, 133);
                  ctx.drawImage(cb.path, 49, 21.5, 48, 48);
                  var timer = setTimeout(function () {
                    console.log('canvas')
                    ctx.draw(false, that.drawPicture()); //draw()的回调函数 
                    clearTimeout(timer)

                  }, 800)
                },
                fail: function (cb) {
                  wx.hideLoading();
                  console.log(that.data.posts.qrCodeUrl)
                }
              })

            },
            fail: function (cb) {
              wx.hideLoading();
              console.log(cb)
            }
          })
        } else {
          var timer = setTimeout(function () {
            ctx.draw(false, that.drawPicture()); //draw()的回调函数 
            clearTimeout(timer)
          }, 800)
        }







      }
    })

  },

  point: function (x, y) {
    return {
      x: x,
      y: y
    };
  },
  //绘制头像
  drawUserImg: function (img, x, y, width, height, ctx) {
    ctx.setFillStyle('#fff')

    //开始路径画圆,剪切处理
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + width / 2, y + width / 2, width / 2, 0, Math.PI * 2, false);
    ctx.setFillStyle('#fff')
    ctx.fill();
    ctx.clip(); //剪切路径
    ctx.drawImage(img, x, y, width, height);
    //恢复状态
    ctx.restore();

  },
  //绘制弧角方块
  drawRoundedRect: function (rect, r, ctx) {
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
    ctx.closePath()
    ctx.fill();


  },
  //文本换行
  textWrap: function (obj, ctx) {
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
        this.drawText(txt, ctx);
      }
    }
  },
  //文本绘制
  drawText: function (obj, ctx) {
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
      ctx.fillText(obj.text, obj.x, obj.y - 0.4);
      ctx.fillText(obj.text, obj.x - 0.4, obj.y);
      ctx.fillText(obj.text, obj.x, obj.y - 0.3);
      ctx.fillText(obj.text, obj.x - 0.3, obj.y);
      ctx.fillText(obj.text, obj.x, obj.y - 0.2);
      ctx.fillText(obj.text, obj.x - 0.2, obj.y);
      ctx.fillText(obj.text, obj.x, obj.y - 0.1);
      ctx.fillText(obj.text, obj.x - 0.1, obj.y);
    }
    ctx.setFillStyle(obj.color);
    ctx.fillText(obj.text, obj.x, obj.y);
    if (obj.bold) {
      ctx.fillText(obj.text, obj.x, obj.y + 0.5);
      ctx.fillText(obj.text, obj.x + 0.5, obj.y);
      ctx.fillText(obj.text, obj.x, obj.y + 0.4);
      ctx.fillText(obj.text, obj.x + 0.4, obj.y);
      ctx.fillText(obj.text, obj.x, obj.y + 0.3);
      ctx.fillText(obj.text, obj.x + 0.3, obj.y);
      ctx.fillText(obj.text, obj.x, obj.y + 0.2);
      ctx.fillText(obj.text, obj.x + 0.2, obj.y);
      ctx.fillText(obj.text, obj.x, obj.y + 0.1);
      ctx.fillText(obj.text, obj.x + 0.1, obj.y);
    }
    ctx.restore();
  },
  //自动换行文本
  autoTxt: function (postertext, ctx) {
    console.log("进入autoTxt")
    var arr = postertext.str.split("\\n")
    ctx.beginPath()
    ctx.setFillStyle(postertext.color);
    ctx.setFontSize(postertext.fontsize);
    var top = postertext.y
    for (var i = 0; i < arr.length; i++) {
      console.log("autoTxt循环")
      top = top + postertext.lineheight
      if (i > 5) {
        return
      }
      ctx.fillText(arr[i], postertext.x, top);
    }
    ctx.fill();
    ctx.closePath()
  },
  //绘制海报
  drawPicture: function () { //生成图片
    console.log("生成")
    wx.showLoading({
      title: "海报生成中"
    })
    var that = this;
    var timer = setTimeout(function () {
      wx.canvasToTempFilePath({ //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
        x: 0,
        y: 0,
        width: 600,
        height: 1000,
        destWidth: 600 * 2, //输出的图片的宽度（写成width的两倍，生成的图片则更清晰）
        destHeight: 1000 * 2,
        fileType: 'jpg',
        quality: 1,
        canvasId: 'shareCanvas',
        success: function (res) {
          console.log(res);
          that.setData({
            canva: res.tempFilePath
          })
          wx.hideLoading();
          // that.draw_uploadFile(res);
        },
        fail: function (res) {
          console.log(res)
          wx.hideLoading();
        }
      })
      clearTimeout(timer)
    }, 900)
  },
  //保存海报至相册
  saveImg: function (e) {
    var that = this
    that.submitformid(e);
    console.log("保存图片")
    wx.getSetting({
      success: (res) => {
        console.log(res);
        console.log(res.authSetting['scope.writePhotosAlbum']);
        if (res.authSetting['scope.writePhotosAlbum'] != undefined && res.authSetting['scope.writePhotosAlbum'] != true) { //非初始化进入该页面,且未授权
          console.log("保存图片提示")
          wx.showModal({
            title: '是否授权保存到相册',
            content: '需要获取您的保存到相册，请确认授权，否则海报将无法保存',
            success: function (res) {
              if (res.cancel) {
                console.info("1授权失败返回数据");

              } else if (res.confirm) {
                wx.openSetting({
                  success: function (data) {
                    console.log("openSetting保存图片")
                    console.log(data);
                    if (data.authSetting["scope.writePhotosAlbum"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 5000
                      })
                      //再次授权，调用getLocationt的API
                      wx.saveImageToPhotosAlbum({
                        filePath: that.data.canva,
                        success(res) {
                          console.log("再次授权保存图片")
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
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 5000
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: that.data.canva,
            success(res) {
              console.log("保存成功")
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
        }
      }
    })


  },
  //关闭海报
  close: function () {
    wx.hideLoading();
    this.setData({
      canvamodel: false,
      groupBox:false
    })
  },

  play() {
    this.setData({
      playimg: false
    })
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.play();
  },
  startplay() {
    this.setData({
      playimg: false
    })
  },
  stopplay() {
    this.setData({
      playimg: true
    })
  },

  toFriend() {
    wx.navigateTo({
      url: '../friend/index?id=' + this.data.id
    })
  },

  toHome() {
    wx.switchTab({
      url: '../home/home'
    })
  },

  toProfit(e) {
    wx.navigateTo({
      url: '../profit/profit'
    })
  },
  //防止滑动穿透
  preventTouchMove(e) {

  },
  /**
    * 生命周期函数--监听页面卸载
    */
  onUnload: function () {
    var that = this
    clearInterval(that.data.timer1)
  },
})