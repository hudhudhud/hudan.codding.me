// pages/my/setInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:[{name:"男",val:1},{name:"女",val:2}],
    defaultSexIndex:-1,
    region:["浙江省","杭州市","萧山区"],
    customItem:"全部",
    birth: '',
    userInfo: {},
    loveBar:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ userInfo: wx.getStorageSync("userInfo") },()=>{
        this.data.sex.forEach((item, i) => {
          if (this.data.userInfo.gender + "" == item.val + "") {
            this.setData({
              defaultSexIndex: i
            })
            return
          }
        })
        if (this.data.userInfo.birth) {
          this.setData({ birth: this.data.userInfo.birth })
        }
    })
   
   
  },

  tapChangeImg: function () {
    wx.chooseImage({
      count: 1,
      sizeType: "compressed",
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://iamabj.club/upload',
          header: { 'session_id': wx.getStorageSync("session_id"), },
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            console.log(res)
          },
          fail: function (err) {
            console.log(err)
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  bindSexPickerChange: function (e) {
    this.setData({
      defaultSexIndex: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      birth: e.detail.value
    })
  },
  formSubmit:function(e){
    console.log(e.detail.value)
    console.log(this.data.sex[this.data.defaultSexIndex].val)
    wx.request({
      url: "https://iamabj.club/user/wx/userInfoUpdate",
      header:{session_id:wx.getStorageSync("session_id")},
      method:"post",
      data: {
        nickName:e.detail.value.nickName,
        gender: this.data.sex[this.data.defaultSexIndex].val,
        phone: e.detail.value.phone,
        province: e.detail.value.address[0],
        city: e.detail.value.address[1],
        area: e.detail.value.address[2],
        birth: e.detail.value.birth
      },
      success: (res)=>{
        console.log(res.data.msg)
        this.data.userInfo=e.detail.value
        wx.setStorageSync("userInfo", this.data.userInfo)
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function (e) {
        console.log("error:" + e)
      }
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