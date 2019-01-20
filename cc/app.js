//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    //this.login()
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  },
  login:function(uinfo,cb){
      wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            var code = res.code
            var name = ""
            if (code) {
              console.log('获取用户登录凭证：' + code)
              if (!uinfo) {
                wx.getUserInfo({
                  withCredentials: false,
                  success: function (data) {
                    name = data.userInfo.nickName
                    wx.request({
                      url: "https://iamabj.club/admin/manage/user/wx/loginByWxcode",
                      data: {
                        code: code,
                        userInfo: data.rawData
                      },
                      success: function (res) {
                        console.log("return:" + JSON.stringify(res))
                        if (res && res.data) {
                          wx.setStorageSync("session_id", res.data.session_id)
                          var userInfo = res.data
                          userInfo.birth = userInfo.birth ? ((new Date(userInfo.birth)).toLocaleDateString()).split('/').join('-') : ""
                          wx.setStorageSync("userInfo", userInfo)
                          if (cb && typeof f == "function") cb(userInfo)
                        }
                      },
                      fail: function (e) {
                        console.log("error:" + e)
                      }
                    })
                  },
                  fail: function (err) {
                    console.log("err:", err)
                  }
                })
              }
              else{
                wx.request({
                  url: "https://iamabj.club/admin/manage/user/wx/loginByWxcode",
                  data: {
                    code: code,
                    userInfo: uinfo.rawData
                  },
                  success: function (res){
                    console.log("return:" + JSON.stringify(res))
                    if (res && res.data) {
                      wx.setStorageSync("session_id", res.data.session_id)
                      var userInfo = res.data
                      userInfo.birth = userInfo.birth ? ((new Date(userInfo.birth)).toLocaleDateString()).split('/').join('-') : ""
                      wx.setStorageSync("userInfo", userInfo)
                      if (cb && typeof cb == "function") cb(userInfo)
                    }
                  },
                  fail: function (e) {
                    console.log("error:" + e)
                  }
                })
              }
            }
            else {
              console.log('获取用户登录凭证失败:' + res.errMsg)
            }
          }
        })
  },
  globalData: {
    userInfo: null
  }
})