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
     plList:[]
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

    //评论假数据，后期发请求取
    var pls = [
      { id: 1, content: "喜欢啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊！", from: "小鑫", deep: 0, parent:null,path:"", },
      { id: 11, content: "非常感谢啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊！", from: "cc", deep: 1, parent: 1, path: "1",},
      { id: 111, content: "不客气！", from: "小鑫", deep: 2, parent: 11 ,path: "1,11", },
      { id: 2, content: "一般般！", from: "红人", deep: 0, parent: null, path: "", },
      { id:3, content: "哈哈哈哈哈哈", from: "容嬷嬷", deep: 0, parent: null, path: "", }]
    var data=pls.filter(item => !item.parent)
    data.forEach(item => {
          var hfs = pls.filter(ch => {
            if(ch.path){
              var tree = ch.path.split(",")
              return tree[0] - "" == item.id
            }
          })
          hfs.forEach(item=>{
            if(item.deep>1){
               var par=pls.find(x=>{return x.id==item.parent})
               if(par){
                 item.parentFrom=par.from
               }
            }
          })
          item.hf=[]
          item.hf.push(...hfs)
    })
    console.log("333", data)
    this.setData({ plList: data})
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