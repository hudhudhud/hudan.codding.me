var session_id = wx.getStorageSync("session_id")
var articleTemp = {
  id: "",
  catg: "",
  coverImg: "",
  title: "",
  beforeTitle:"",
  styleTx:"",
  nopadding:false,
  zanUserIds: [],
  zan:"",// function(){return this.zanUserIds.indexOf(session_id) > -1},
  hiddenImg:false,
  "tapZan": function (e) {
    var self=this
    if (!wx.getStorageSync("session_id")){//判断是否已经登录
      
      var app = getApp()
      app.login((res) => {
        //开始点赞
        articleTemp.zan.bind(self)(e)
        console.log("登录成功！")
      })
      //后续改成弹框选择登录！！！！！
    }
    else{
      articleTemp.zan.bind(self)(e)
    }
  },
  zan:function(e){
    console.log('zannnnnnnnnnn')
    //开始点赞
    var id = e.currentTarget.dataset.id
    //首页，详情页，分类页都有用，single用来区分当前是首页还是详情页
    var item = this.data.single ? this.data.article : this.data.articles.find(item => item._id == id)
    var sta = !item.zan ? 1 : 0
    wx.request({
      url: `https://iamabj.club/admin/manage/article/api/zan/${id}/${sta}`,
      header: { 'session_id': wx.getStorageSync("session_id"), },
      success: (res) => {
        console.log(res)
        item.zan = !item.zan
        item.zanUserIds = res.data.zanUserIds
        this.data.single ? this.setData({ article: item }) : this.setData({ articles: this.data.articles })
      }
    })
  }
}
module.exports.articleTemp = articleTemp


