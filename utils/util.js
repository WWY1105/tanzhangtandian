//   const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

// module.exports = {
//   formatTime: formatTime
// }


const md5 = require('./md5.js');

const formatTime = date => {
  console.log(date);
  let weekArr = ['日', '一', '二', '三', '四', '五', '六'];
  let str = date.split("-")[1] + "." + date.split("-")[1] + "/";
  date = new Date(date);
  if (date.toDateString() === new Date().toDateString()) {
    str = '今天';
  } else {
    str = "周" + weekArr[date.getDay()];
  }
  return str;
}
const getDistance = distance => {
  let str = "";
  if (distance < 1000) {
    str += "m"
  } else {
    distance = distance / 1000;
    str = parseInt(distance) + "km";
  }
  return str;
}
const getUrl = function (url, para = {}) {
  const app = getApp();
  //origin
  url += "?";
  const password = "037925fa578c4ed98885d7b28ade5462";
  let j = JSON.parse(JSON.stringify(para));//param's json
  j.timestamp = (new Date).getTime();
  let key_json = Object.keys(j);
  key_json.sort();
  let encode_str = "";
  for (let h in key_json) {
    encode_str += key_json[h] + "=" + j[key_json[h]];
    url += key_json[h] + "=" + j[key_json[h]] + "&";
  }
  let i = md5.hexMD5(encode_str + password), m = "";
  for (let o = 0; o < i.length; o += 2) m += i.charAt(o);
  for (let s = 1; s < i.length; s += 2) m += i.charAt(s);
  return app.globalData.ajaxOrigin + url + "signature=" + m;
};
//json={url，method,success}
let goon = true;
const ajax = function (json) {
  if (!goon) return;
  if (json.method == 'POST') {
    json.url = getUrl(json.url)
  } else {
    json.url = getUrl(json.url, json.data);
    json.data = {};
  }
  const app = getApp();
  wx.request({
    url: json.url,
    header: app.globalData.token,
    method: json.method || 'GET',
    data: json.data,
    success: function (res) {
      let data = res.data;
      if (data.code == 403000) {
        goon = false;
        wx.removeStorageSync('token');
        //login
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
              //发起网络请求
              wx.request({
                url: getUrl('/auth'),
                method: 'POST',
                header: app.globalData.token,
                data: {
                  code: res.code
                },
                success: function (res) {
                  let data = res.data;
                  if (data.code == 200) {
                    goon = true;
                    if (data.result.token) {
                      wx.setStorageSync('token', data.result.token);
                      app.globalData.token.token = data.result.token;
                    }
                    if (getCurrentPages().length != 0) {
                      //刷新当前页面的数据
                      console.log(1)
                      getCurrentPages()[getCurrentPages().length - 1].onShow()
                    }
                  } else {
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    });
                  }
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      } else {
        json.success(res);
      }
    }
  });

}

module.exports = {
  // formatTime: formatTime,
  getUrl: getUrl,
  // getDistance: getDistance,
  ajax: ajax
}
