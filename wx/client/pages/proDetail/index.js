Page({
  data: {
   pro:null,
   chooseSpec:[],
   chooseNum:1,
   carNum:0,
  },
  onLoad:function(queryStr){
    if (queryStr && queryStr.id){
      var app = getApp()
      this.data.pro=app.getProById(queryStr.id)
      if (this.data.pro){
        this.setData({pro:this.data.pro})
      }
    }
    //设置当前选中的是默认值
    this.data.chooseSpec = this.data.pro.detail.spec.map((item, i) => {
      return { name: item.name, content: item.content.find(a => a.default) ? (item.content.find(a => a.default).val) : (item.content.length == 1 ? item.content[0].val : null) }
    })

    //加入购物车之后返回到页面是选中加入的
    for(var item of this.data.chooseSpec){
      if (queryStr && queryStr[item.name]) {
        item.content = queryStr[item.name]
      }
    }
    this.setData({ chooseSpec: this.data.chooseSpec})

    var carData = wx.getStorageSync("carList") || []
    var carNum=carData.reduce((res,item)=>{res+=item.num;return res},0)    
    this.setData({carNum})
  },
  goSpec:function(e){
    wx.navigateTo({
      url: '../proSpec/index?id='+this.data.pro.id,
    })
  },
  goCar:function(){
    wx.switchTab({
      url: '../shoppingCar/index',
      fail:function(e){
        console.log(e)
      }
    })
  }
})