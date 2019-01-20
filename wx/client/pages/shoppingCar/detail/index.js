// pages/shoppingCar/catg/index.js
Page({
  data: {
      numAry:[1,2,3],
      num: 0,//因picker，为numAry下标
      specList:null,
      pro:null,
      chooseSpec:null,
      index:-1
  },
  onLoad: function (queryStr) {
    if (queryStr && queryStr.id){
      var app = getApp()
      this.data.pro = app.getProById(queryStr.id)
      if (this.data.pro) {
        this.setData({ pro: this.data.pro })
        var specList = this.getSpecList(this.data.pro)
        this.setData({specList})
      }
    }
    if (queryStr&&queryStr.index){
      this.setData({ index: queryStr.index})
      var carData = wx.getStorageSync("carList") || []
      this.setData({ num: carData[this.data.index].num-1})
      var isTheSame=true
      for (var item of this.data.specList){
         isTheSame = true
        for (var key in carData[this.data.index].chooseSpec){
          if (item[key] != carData[this.data.index].chooseSpec[key]){
             isTheSame=false
             break
          }
        }
        if(isTheSame){
          this.setData({ chooseSpec: item })
          break
        }
      }
    }
  },
  bindPickerChange:function(e){
      this.setData({ num: e.detail.value})
  },
  bindChooseSpec:function(e){
      var index=e.currentTarget.dataset.index
      this.setData({chooseSpec:this.data.specList[index]})
  },
  bindCommit: function () {
    wx.showLoading({
      title: '请等待...',
      mask: true,
      success: () => {
        //存数据到缓存
              var carData = wx.getStorageSync("carList") || []
              var current= carData[this.data.index]
              current.num =this.data.numAry[this.data.num]
              if (this.data.chooseSpec){
                current.price = this.data.chooseSpec.price
                current.img = this.data.chooseSpec.img
                for (var key in current.chooseSpec) {
                  current.chooseSpec[key] = this.data.chooseSpec[key]
                }
              }
              current.specStr=Object.values(current.chooseSpec).join(" ")
              wx.setStorageSync("carList", carData)
            }
    })
    setTimeout(() => {
      //跳转到商品详情
      wx.navigateBack({})
      wx.hideLoading()
    }, 2000)
  },
  bindDelete: function () {
    wx.showLoading({
      title: '请等待...',
      mask: true,
      success: () => {
        var carData = wx.getStorageSync("carList") || []
        carData.splice(this.data.index, 1)
        wx.setStorageSync("carList", carData)
    }})
    setTimeout(() => {
      //跳转到商品详情
      wx.navigateBack({})
      wx.hideLoading()
    }, 2000)
  },
  getSpecList: function (item) {
    var list = item.detail.spec
    var res = []
    var index = 0
    for (var i = 0; i < list.length - 1; i++) {
      var sp = list[i].content
      var spname = list[i].name
      var sp1 = list[i + 1].content
      var sp1name = list[i + 1].name
      for (var v of sp) {
        for (var v1 of sp1) {
          res[index] = {}
          res[index].specStr = v.val + " " + v1.val
          res[index][spname] = v.val
          res[index][sp1name] = v1.val
          res[index].price = v.price ? v.price : (v1.price?v1.price:item.price)
          res[index].img=v.img?v.img:(v1.img?v1.img:item.img)
          index++
        }
      }
    }
    return res
  }
})