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
      zan: false,
      catgIndex:0,
      catgs: [
        {name: "美食",val: "1", bar: [{id:1,name: "三餐专栏", url: "../meals/index"}, { id: 2, name: "食谱指南", url: "../tagList/index" }]}, 
        { name: "美妆", val: "2", bar: [{ name: "护肤专栏", url: "" }, { name: "彩妆专栏", url: "" }]},
        { name: "服饰", val: "3", bar: [{ name: "服装专栏", url: "" }, { name: "配饰专栏", url: "" }]}, 
        { name: "健身", val: "4", bar: [{ name: "签到训练", url: "" }, { name: "动作库", url: "" }, { name: "健身达人", url: "" }]}, 
        { name: "家居", val: "5", bar: [{ name: "分类指南", url: "" }]}],

      touchStartX:0,
      touchStartY: 0,
      reachBottom:false,
      left:0,
      containWith:0,
      barDis:0,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (option) {
      topNavbarTemp.onLoad.bind(this)()
      this.data.catgs.forEach((item, i) => { item.left = i * 100; item.barwidth = 100 / item.bar.length;})
      var catgModel = this.data.catgs[this.data.catgIndex]
      this.setData({ catgs: this.data.catgs, containWith: this.data.catgs.length * 100})
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
          this.data.catgs.forEach((item) => {
            if (!item.sliderImgs){
                  var res=this.data.articles.find(a=>a.catg==item.val)
                  item.sliderImgs=res.sliderImgs
               }
          })
          this.setData({ articles: res.data, catgs:this.data.catgs })
          wx.stopPullDownRefresh()
          this.setData({ reachtop: false })
        }
      })
    },
    onGotUserInfo(){
      console.log(e.detail.userInfo)
    },
    tapZan(e) {
      articleTemp.tapZan.bind(this)(e)
    },
    //切换分类
    tapCatg(e){
      topNavbarTemp.tapCatg.bind(this)(e)
    },
    //左右滑动切换分类
    touchstart(e){
      this.setData({ touchStartX:e.touches[0].pageX})
      console.log(e)
    },
    touchend(e) {
      console.log(e)
      if (e.changedTouches[0].pageX - this.data.touchStartX < - 150 && this.data.catgIndex <this.data.catgs.length - 1) {
        this.setData({ catgIndex: this.data.catgIndex + 1 })
        console.log("向左滑")
        this.tapCatg(null)
      }
      if (e.changedTouches[0].pageX - this.data.touchStartX > 150 && this.data.catgIndex >= 1){
        this.setData({ catgIndex: this.data.catgIndex - 1})
        console.log("向右滑")
        this.tapCatg(null)
      }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh:function(){
      console.log("toppppppppppppppp")
      this.setData({ reachtop:true})
      this.onLoad()
    },
    onPageScroll:function(e){
      //e.scrollTop
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
      this.onLoad()
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      console.log("bottommmmmmmmmmmmmmmm")
      this.setData({ reachBottom:true})
      var session_id = wx.getStorageSync("session_id")
      console.log(this.data.catgs[this.data.catgIndex].val)
      wx.request({
        url: 'https://iamabj.club/admin/manage/article/api?catg='+this.data.catgs[this.data.catgIndex].val,
        success: (res) => {
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
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
  })