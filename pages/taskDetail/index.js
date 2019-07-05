// pages/taskDetail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sharebg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/sharebg.png", 'base64'),
    canvasBox: false,
    selectBtn: 3,
    canvasBg:'',
    id:'',
    text:{},
    canva:'',
    selectOk: wx.getStorageSync('selectOk')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.q) {
      var src = decodeURIComponent(options.q)
      this.setData({
        id: src.match(/saler\/(\S*)/)[1]
      })
    } else if (options.id) {
      this.setData({
        id: options.id
      })
    }
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
    this.getDate();
  },
  getDate() {
    var that = this;
    wx.request({
      url: app.util.getUrl('/tasks/tasks/' + that.data.id),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        console.log(res)
        if (data.code == 200) {
          that.setData({
            posts: data.result
          })
          
          // if (data.result.received || data.result.selfReceived){
          //   wx.navigateTo({
          //     url: '../share/share?id=' + that.data.id
          //   })
          // }else{
          //   that.setData({
          //     init:false
          //   })
          // }
          
        } else if (data.code == 403000) {
          wx.removeStorageSync('token')
        } else {
          wx.showToast({
            title: data.message,
            duration: 2000
          });
        }

        // let inittimer = setTimeout(function () {
        //   if (!canvas) {
        //     wx.hideLoading();
        //   }

        //   that.setData({
        //     init: false
        //   })
        //   clearTimeout(inittimer);
        // }, 1000)
      }
    });
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
          var pic;
          if (that.data.posts.poster) {
            pic = that.data.posts.poster
          } else {
            pic = that.data.posts.posters[0]
          }
          wx.getImageInfo({
            src: pic.picUrl,
            success: function (res) {
              that.setData({
                canvasBg: res.path
              })

            }
          })
          if (that.data.posts.avatarUrl){
            wx.getImageInfo({
              src: that.data.posts.avatarUrl,
              success: function (res) {
                that.setData({
                  canvasAvatar: res.path
                })
              }
            })
          }
        } else if (data.code == 403000) {
          wx.removeStorageSync('token')
        } else {
          wx.showToast({
            title: data.message,
            duration: 2000
          });
        }
      }
    });
  },
  selectBtn(e) {
    console.log(e)
    var that = this
    console.log(e.detail.target.dataset.btn + "," + this.data.selectBtn)
    if (e.detail.target.dataset.btn !== this.data.selectBtn) {
      this.setData({
        selectBtn: e.detail.target.dataset.btn
      })
    }
  },
  //提交背书\模式
  submittext(e) {
    wx.showLoading({
      title: "加载中"
    })
    var that = this
    console.log(e)
    var json = {
      "posterId": that.data.text.id,
      "formId": e.detail.formId == 'the formId is a mock one' ? '' : e.detail.formId,
      "mode": that.data.selectBtn
    }
    console.log(json)

    wx.request({
      url: app.util.getUrl('/tasks/task/' + that.data.id + '/invitation'),
      method: 'POST',
      header: app.globalData.token,
      data: json,
      success: function (res) {
        let data = res.data;
        if (data.code==200){
          wx.hideLoading();
          that.setData({
            selectOk: true
          })
          wx.setStorageSync('selectOk', true)
        }
        console.log("res")
        console.log(res)
        that.setData({
          canvasBox: true,
          canvamodel: true
        })
        // that.getdata(true)

      }
    });
    
    console.log(e)
  },
  getFormId(e){
    this.setData({
      formId: e.detail.formId == 'the formId is a mock one' ? '' : e.detail.formId,
    })
  },
  toshopDetail() {
    console.log("1020202")
    wx.navigateTo({
      url: '../shopDetail/index?id=' + this.data.id +"&source=taskDetail"
    })
  },
  getPhoneNumber(e) {
    wx.showLoading({
      title: '加载中',
    })
    console.log("手机号")
    console.log(e)


    var that = this
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {
          wx.hideLoading();
        },
        fail: function(){
          wx.hideLoading();
        }
      })
    } else {

      wx.request({
        url: app.util.getUrl('/phone/bind'),
        method: 'POST',
        data: {
          "iv": e.detail.iv,
          "encryptedData": e.detail.encryptedData,
        },
        header: app.globalData.token,
        success: function (res) {
          console.log("/phone/bind")
          console.log(res)
          wx.hideLoading();
          let data = res.data;
          if (data.code == 200 || data.code == 405025) {
            if (data.result) {
              wx.setStorageSync('token', data.result.token);
              app.globalData.token.token = data.result.token
            }
            
            wx.showToast({
              title: "授权成功",
              duration: 2000
            });
            var json = {
              "posterId": that.data.text.id,
              "formId": that.data.text.formId == 'the formId is a mock one' ? '' : that.data.text.formId,
              "mode": that.data.selectBtn
            }
            console.log(json)

            wx.request({
              url: app.util.getUrl('/tasks/task/' + that.data.id + '/invitation'),
              method: 'POST',
              header: app.globalData.token,
              data: json,
              success: function (res) {
                let data = res.data;
                that.setData({
                  selectOk: true
                })
                wx.setStorageSync('selectOk', true)
                console.log("res")
                console.log(res)
                // that.setData({
                //   canvasBox: true,
                //   groupBox: false,
                //   canvamodel: true
                // })
              },
              fail: function () {
                wx.hideLoading();
              }
            });
          } else {
            wx.showToast({
              title: data.message,
              duration: 2000
            });
          }
        },
        fail: function () {
          wx.hideLoading();
        }
      });
    }
  },
  picture: function () {
    wx.showLoading({
      title: "海报生成中"
    })
    console.log("点击")
    var that = this;
    if (that.data.canvasBg && that.data.canvasAvatar && that.data.canvasQrCode) {
      clearTimeout(canvasTimer)
    } else {
      var canvasTimer = setTimeout(function () {
        times++
        if (times > 8) {
          wx.hideLoading();
          wx.showToast({
            title: '海报生成失败',
            duration: 2000
          })
          clearTimeout(canvasTimer)
          return false;
        } else {
          that.picture()
          clearTimeout(canvasTimer)
        }

      }, 1000)
      return false;
    }
    console.log("画")
    const ctx = wx.createCanvasContext('shareCanvas');
    var pic;
    if (that.data.posts.poster) {
      pic = that.data.posts.poster
    } else {
      pic = that.data.posts.posters[that.data.num]
    }



    ctx.drawImage(that.data.canvasBg, 0, 0, 600, 1000); //绘制背景图
    console.log('背景图')
    if (that.data.posts.nickname) {
      ctx.setTextAlign('left');
      ctx.setFontSize(27);
      ctx.fillText(that.data.posts.nickname, 125, 56);
    }

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
      text: (that.data.posts.mode == '1000' || that.data.posts.mode == '1001') ? '邀你一起拆探店红包' : '邀你组团分现金红包',
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
      text: (that.data.posts.mode == '1000' || that.data.posts.mode == '1001') ? '为我助力!' : '一起来瓜分!',
      bold: true
    }
    that.textWrap(obj2, ctx)

    console.log("cb")
    ctx.drawImage(that.data.canvasQrCode, 387, 734.5, 133, 133);
    ctx.drawImage(that.data.canvasAvatar, 49, 21.5, 48, 48);
    var timer = setTimeout(function () {
      console.log('canvas')
      ctx.draw(false, that.drawPicture()); //draw()的回调函数 
      clearTimeout(timer)

    }, 800)

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
      canvamodel: false
    })
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
    wx.removeStorageSync('selectOk')
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