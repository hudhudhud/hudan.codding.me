// pages/login/index.js
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  bindlogin:function(e){
    console.log(e.detail.value)
  },
  bindWxlogin:function(e){
    wx.login({
      success: function (res) {
        var code = res.code
        var name = ""
        if (code) {
          console.log('获取用户登录凭证：' + code)
          wx.getUserInfo({
            withCredentials: false,
            success: function (data) {
              name = data.userInfo.nickName
              //{errMsg: "getUserInfo:ok", rawData: "{"nickName":"iamabj","gender":2,"language":"zh_CN"…RnSTsMEJtQ792cfuoehcYMxvnhqnkfTZ4DTljg9DZXAzA/0"}", userInfo: {…}, signature: undefined}
              console.log(data)
              try{
                wx.request({
                  url: "https://iamabj.club/login/wx/loginByWxcode",
                  data: {
                    code: code,
                    userInfo: data.rawData
                  },
                  success: function (res) {
                    console.log("return:" + JSON.stringify(res))
                  },
                  fail: function (e) {
                    console.log("error:" + e)
                  }
                })
              }
              catch(e){
                console.log(e)
              }
            }
            
          })
        }
        else {
          console.log('获取用户登录凭证失败:' + res.errMsg)
        }
      }
    })
  }
  
})