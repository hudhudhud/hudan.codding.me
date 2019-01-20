Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCatg:1,
    catgList: [],
    proList:[],
    showList:{},
    scrollViewLeft: "catg_1",
    scrollTop: 0,
    scrollViewRight:"item_catg_1",
    sysInfo:null,
    //设计以iphone6，因为滚动导航需要判断高度来定位，所以用px,而不是rpx(按照pixelRatio自动转换)
    css_height: {
      catg_img: 95,
      catg_name: 50,
      catg_item: 150,}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp()
    app.getCatgList((catgList) => this.setData({ catgList}))
    app.getProList((proList) => this.setData({ proList }))
    app.getSysInfo(sysInfo=> this.setData({ sysInfo }))

    for(var item of this.data.proList){
      if (Object.prototype.hasOwnProperty.call(this.data.showList,item.catg)){
        this.data.showList[item.catg].push(item)
      }
      else{
        var ary=[]
        this.data.showList[item.catg] = ary, ary.push(item)
      }
    }
    var preTop=0
    var adviceHeight = (this.data.css_height.catg_img + this.data.css_height.catg_name) 
    var proHeight = this.data.css_height.catg_item
    for(var catg of this.data.catgList){
      if (this.data.showList[catg.id] && this.data.showList[catg.id].length){
        catg.top = preTop
        catg.topHeight = (parseInt(this.data.showList[catg.id].length) / 3 + this.data.showList[catg.id].length % 3 > 0 ? 1 : 0) * proHeight + adviceHeight + preTop
      }
      else{
        catg.top = preTop
        catg.topHeight = adviceHeight + preTop
      }
      preTop = catg.topHeight
    }
    this.setData({ 
     showList: this.data.showList,
     catgList:this.data.catgList
     })
  },
  catgTap:function(e){
    var id=e.target.dataset.id
    this.setData({
      currentCatg:id,
      catgList: this.data.catgList,
      scrollViewRight:"item_catg_"+id,
    })
  },
  scroll:function(e){
    var top = e.detail.scrollTop
    //var height=e.detail.scrollHeight
    for(var catg of this.data.catgList){
      if(top>catg.top&&top<catg.topHeight){
        //console.log(catg.id, this.data.catgList)
        this.setData({
          currentCatg:catg.id,
          //scrollViewLeft: "catg_" + catg.id
        })
        break;
      }
    }
  },
  scrolltoupper:function(){
    this.setData({
      scrollTop: 0
    })
  },
  scrolltolower:function(){
    this.setData({
      scrollTop: 350
    })
  },
  goItemDetail:function(e){
    var id = e.currentTarget.dataset.id
    if(id){
     wx.navigateTo({
       url: '../proDetail/index?id='+id,
       success:function(data){
       },
       fail:function(err){
         console.log(err)
       }
     })
    }
  }
})