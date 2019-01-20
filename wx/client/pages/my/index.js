// pages/my/index.js
Page({
  data: {
    userInfo:null,
  },
  onLoad: function (options) {
    var app=getApp()
    app.getUserInfo((userInfo)=>this.setData({userInfo}))
  },
  bindGoLogin:function(){
    wx.navigateTo({
      url: '../login/index',
    })
  },
  
})