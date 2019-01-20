import {
  articleTemp
} from "../../template/article/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
     catg:"",
     article:{},
     single:true,
     plList:[],
     popPl:false,
     textareaFocus:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (queryStr) {
    queryStr={}
    queryStr.id = "5af565430d75df214a0504e9"
    queryStr.catg=3
    if (queryStr && queryStr.id) {
       var session_id = wx.getStorageSync("session_id")
        wx.request({
          url: 'https://iamabj.club/admin/manage/article/api/' + queryStr.id,
          success: (res) => {
            console.log(res.data)
            res.data.details=res.data.details.replace(/\<img/gi, '<img style="max-width:100%;height:auto;padding:0;" ')

            if (res.data.zanUserIds.indexOf(session_id) > -1) {
              res.data.zan = true
            }
            else res.data.zan = false

            this.setData({ article: res.data })
            this.setData({ catg: res.data.catg })
          }
        })
    }


    var pls = [
      { id: 1, content: "喜欢啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊！", from: "小鑫", deep: 0, parent: "", },
      { id: 11, content: "非常感谢啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊！", from: "cc", deep: 1, parent: "1" },
        { id: 111, content: "不客气！", from: "小鑫", deep: 2, parent: "1,11" },
        { id: 2, content: "一般般！", from: "红人", deep: 0, parent: "" }]
    var data=pls.filter(item => !item.parent)
    data.forEach(item => {
          var hfs = pls.filter(ch => {
            if(ch.parent){
              var tree = ch.parent.split(",")
              return tree[0] - "" == item.id
            }
          })
          //console.log("222",hfs)
          item.hf=[]
          item.hf.push(...hfs)
    })
    console.log("333", data)
    this.setData({ plList: data})
  },

  tapZan(e) {
    articleTemp.tapZan.bind(this)(e)
  },

  tapPj(){
    console.log("弹出")
    this.setData({ popPl: true })
  },
  tapPlPop(){
    console.log("取消")
    this.setData({ popPl: false, textareaFocus:true })
  },
  bindconfirm(e){
    console.log("啦啦啦啦",e.detail)
    this.setData({ popPl: false })
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