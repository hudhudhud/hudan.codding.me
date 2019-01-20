Page({
  data: {
    pro: null,
    chooseSpec:{},
    num: 1,
    img:null,
    specStr:"",
  },
  onLoad: function (queryStr) {
    if (queryStr && queryStr.id) {
      var app = getApp()
      this.data.pro = app.getProById(queryStr.id)
      if (this.data.pro) {
        this.setData({ pro: this.data.pro })
      }
    }
    this.data.pro.detail.spec.forEach((item, i) => {
      var def = item.content.find(a => a.default) || (item.content.length == 1 ? item.content[0]:null)
      if (def&&!this.data.img&&def&&def.img){
        this.setData({img:def.img})
      }
      this.data.chooseSpec[item.name]= def.val
    })
    this.setData({ chooseSpec: this.data.chooseSpec,specStr: Object.values(this.data.chooseSpec).join(" ") })
  },
  changeInfo:function(e){
    var dt = e.target.dataset
    if(dt.spec.price||dt.spec.img){
      if (dt.spec.price) {
        this.data.pro.price = dt.spec.price
        this.setData({
          pro: this.data.pro,
          chooseSpec: (this.data.chooseSpec[dt.key] = dt.spec.val, this.data.chooseSpec),
          specStr: Object.values(this.data.chooseSpec).join(" ")
        })
      }
      if (dt.spec.img) {
        this.data.img = dt.spec.img
        this.setData({
          img: this.data.img,
          chooseSpec: (this.data.chooseSpec[dt.key] = dt.spec.val, this.data.chooseSpec),
          specStr: Object.values(this.data.chooseSpec).join(" ")
        })
      }
    }
    else{
      this.setData({
        chooseSpec: (this.data.chooseSpec[dt.key] = dt.spec.val, this.data.chooseSpec),
        specStr: Object.values(this.data.chooseSpec).join(" ")
      })
    }
  },
  minusNum:function(e){
    if(this.data.num<=1)return
    this.setData({
      num:--this.data.num
    })
  },
  addNum:function(e){
    if (this.data.num >=this.data.pro.maxNum) return
    this.setData({
      num: ++this.data.num
    })
  },
  addCar:function(e){
    wx.showLoading({
      title: '请等待...',
      mask: true,
      success: () => {
        //存数据到缓存
        var carData=wx.getStorageSync("carList") || []
        var currPro = carData.filter(item=>item.id==this.data.pro.id)
        if (currPro && currPro.length>0){
          var app = getApp()
          for (var item of currPro){
            var isTheSame = app.isEqual(item.chooseSpec, this.data.chooseSpec)
            if (isTheSame) {
              item.num += this.data.num
              wx.setStorageSync("carList", carData)
              break
            }
          }
        }
        if(!currPro||!isTheSame){
          var item = {
            "id": this.data.pro.id,
            "name": this.data.pro.name,
            "img": this.data.img,
            "num": this.data.num,
            "price": this.data.pro.price,
            "chooseSpec": this.data.chooseSpec,
            "specStr": Object.values(this.data.chooseSpec).join(" ")
          }
          // Object.defineProperty(item, "specStr", {
          //   enumerable: true,
          //   get:function(){
          //     return Object.values(this.chooseSpec).join(" ")
          //   }
          // })//微信缓存对象好像不支持getter
          wx.setStorageSync("carList", (carData.push(item), carData))
        }
        
        setTimeout(() => {
          var str = Object.keys(this.data.chooseSpec).reduce((res, item) => { res += `&${item}=${this.data.chooseSpec[item]}`; return res }, "")
          //跳转到商品详情
          wx.navigateTo({
            url: `../proDetail/index?id=${this.data.pro.id}${str}`,
                success:()=>{
                  wx.showToast({
                    title: '成功加入购物车',
                    icon: 'success',
                    duration: 3000,})
                }
              })
              wx.hideLoading()
        }, 2000)
      }
    })
  }
})