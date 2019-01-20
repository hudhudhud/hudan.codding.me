// pages/my/index.js
import {
  articleTemp
} from "../../template/article/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loveNum:0,
    msgNum:0,
    userInfo: {},
    modal_Title:"登录",
    is_modal_Hidden:true,
    articles:[],
    loveBar:true,
    isTop:false,
    reachBottom:false,
    allLovePage:3,
    currLovePage:1,
    allMsgPage: 2,
    currMsgPage: 1,
    msgs: [{ fromTx:'https://iamabj.club/img/upload/1526031678493.jpeg',
    fromName:"cc有缘人",
    content: "good1!"
    }, {
      fromTx: 'https://iamabj.club/img/upload/1526031678493.jpeg',
      fromName: "cc有缘人",
      content: "good2!"
      }, {
        fromTx: 'https://iamabj.club/img/upload/1526031678493.jpeg',
        fromName: "cc有缘人",
        content: "good3!"
    },{
      fromTx: 'https://iamabj.club/img/upload/1526031678493.jpeg',
      fromName: "cc有缘人",
      content: "good4!"
      }, {
        fromTx: 'https://iamabj.club/img/upload/1526031678493.jpeg',
        fromName: "cc有缘人",
        content: "good5!"
    }, {
      fromTx: 'https://iamabj.club/img/upload/1526031678493.jpeg',
      fromName: "cc有缘人",
      content: "good6!"
      },]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        this.setData({ articles: res.data})
      }
    })
  },
  onPageScroll: function (e) {
    var top = e.scrollTop
    if(top>0){
      this.setData({ isTop:true})
    }else{
      this.setData({ isTop: false })
    }
  },
  
  tapBar:function(e){
    console.log(e)
    var key = e.currentTarget.dataset.name
    if(key=="loveBar"){
      this.setData({ loveBar: true })
    }
    else{
      this.setData({ loveBar: false })
    }
  },
  tapLogin:function(){
    this.setData({ is_modal_Hidden:false})
  },
  tapGotUserInfo(e) {
    console.log(e.detail.userInfo)
    if(e.detail.userInfo){
      var app = getApp()
      app.login(e.detail,(res) => { 
        this.setData({ "userInfo": res, is_modal_Hidden: true});
        console.log("登录成功！")
      })
    }
  },
  tapsetInfo:function(){
    wx.navigateTo({
      url: './setInfo/index',
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
    this.setData({userInfo:wx.getStorageSync("userInfo")})
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
    console.log("bottommmmmmmmmmmmmmmm")
    this.setData({ reachBottom: true })
    if(this.data.loveBar){
      var session_id = wx.getStorageSync("session_id")
      if (this.data.currLovePage < this.data.allLovePage) {
          this.data.currLovePage+=1
          wx.request({
            url: 'https://iamabj.club/admin/manage/article/api',
            success: (res) => {
              this.setData({ currLovePage: this.data.currLovePage})
                res.data.forEach(item => {
                  if (item.zanUserIds.indexOf(session_id) > -1) {
                    item.zan = true
                  }
                  else item.zan = false
                })
                this.data.articles.push(...res.data)
                this.setData({ articles: this.data.articles })
                this.setData({ reachBottom: false })
              }
          })
      }
      else{
        this.setData({ reachBottom: false })
      }
    }
    else{
      if (this.data.currMsgPage < this.data.allMsgPage) {
        this.data.currMsgPage += 1
            setTimeout(()=>{
              this.setData({ currMsgPage: this.data.currMsgPage })
              this.data.msgs.push(...this.data.msgs)
              this.setData({ msgs: this.data.msgs })
              this.setData({ reachBottom: false })
            },1000)
      }
      else {
        this.setData({ reachBottom: false })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})