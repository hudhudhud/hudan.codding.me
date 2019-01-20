// pages/tagList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tags:[
        {
          name: "场合分类", tags: [{ name: "逛街", url: "/img/cj.jpg" }, { name: "职场", url: "/img/cj.jpg" }
            , { name: "家里", url: "/img/cj.jpg" }, { name: "旅行", url: "/img/cj.jpg" }
            , { name: "健身房", url: "/img/cj.jpg" }, { name: "活动", url: "/img/cj.jpg" }],
          show: 2,
        },
        {
          name: "蔬菜", tags: [{ name: "菠菜", url: "/img/bc.png" }, { name: "菠菜", url: "/img/bc.png" }
            , { name: "菠菜", url: "/img/bc.png" }, { name: "菠菜", url: "/img/bc.png" }, { name: "菠菜", url: "/img/bc.png" }
            , { name: "菠菜", url: "/img/bc.png" }, { name: "菠菜", url: "/img/bc.png" }],
          show:3,
        },
        {
          name: "水果", tags: [{ name: "菠菜", url: "/img/bc.png" }, { name: "菠菜", url: "/img/bc.png" }
            , { name: "菠菜", url: "/img/bc.png" }, { name: "菠菜", url: "/img/bc.png" }, { name: "菠菜", url: "/img/bc.png" }],
          show: 3,
        }

      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.title
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