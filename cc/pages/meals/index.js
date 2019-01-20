import {
  articleTemp
} from "../../template/article/index";
import {
  topNavbarTemp
} from "../../template/topNavbar/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: [],
    models: [
      {
        id: "1",
        tags: [
          { id: 101, val: "早餐" },
          { id: 102, val: "午餐" },
          { id: 103, val: "晚餐" },
        ]
      },
      {
        id: "2",
        group: [
          { id: 10, val: "蔬菜" },
          { id: 11, val: "水果" },
          { id: 12, val: "肉类" },
        ]
      }
    ],

    catgIndex:0,
    catgs: [
      { id: 1, name: "早餐" ,show:2},
      { id: 2, name: "午餐" , show:1},
      { id: 3, name: "晚餐" , show: 2},
      { id: 3, name: "晚餐", show: 2 },
    ],
    barDis:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.title
    })
    topNavbarTemp.onLoad.bind(this)()
    // var model=this.data.models.find(item = item.id == options.modelId)
    // this.setData({tags:this.data.models.find(item=item.id==options.modelId)})


    var session_id = wx.getStorageSync("session_id")
    wx.request({
      url: 'https://iamabj.club/admin/manage/article/api',
      success: (res) => {
        res.data.forEach(item => {
          if (item.zanUserIds.indexOf(session_id) > -1) {
            item.zan = true
          }
          else item.zan = false
        })
        this.setData({ articles: res.data })
      }
    })
  },

  tapCatg:function(e){
    topNavbarTemp.tapCatg.bind(this)(e)
  },

  tapZan(e) {
    articleTemp.tapZan.bind(this)(e)
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
    var session_id = wx.getStorageSync("session_id")
    wx.request({
      url: 'https://iamabj.club/admin/manage/article/api',
      success: (res) => {
        res.data.forEach(item => {
          if (item.zanUserIds.indexOf(session_id) > -1) {
            item.zan = true
          }
          else item.zan = false
        })
        this.setData({ articles: res.data })
      }
    })
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