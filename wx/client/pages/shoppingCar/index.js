Page({
  data: {
    carList:[],
    checkAll:true,
    allCheckedMoney:null,
    allCheckedNum:null,
    preX:0,

    is_modal_Hidden:true,
    is_modal_Msg:"小主留情ヾ(◍°∇°◍)ﾉﾞ",
    is_modal_cancelmsg:"去意已决",
    is_modal_suremsg:"留情"

  },
  onShow:function(){
    wx.checkSession({
      success:(data)=>{
       var header = {
          'content-type': 'application/x-www-form-urlencoded',
          'session_id': wx.getStorageSync("session_id"),
         // 'cookie': `session_id=${wx.getStorageSync("session_id")}`//读取cookie
        };
       // var qcloud = require('../../vendor/wafer2-client-sdk/index.js');
        wx.request({
          url: 'https://iamabj.club/login/wx',
          header,
          success:(res)=>{
            console.log(res)
            if (res.data.user){
                  var carList = (wx.getStorageSync("carList") || []).map(item => { item.checked = true; item.move = false; return item })
                  var allCheckedNum = carList.reduce((res, item) => res += (item.checked ? item.num - '' : 0), 0)
                  var allCheckedMoney = carList.reduce((res, item) => res += (item.checked ? item.price * item.num : 0), 0)
                  this.setData({ carList, allCheckedMoney, allCheckedNum })
                  //更新导航购物车数量
                  var carNum = this.data.carList.reduce((res, item) => { res += item.num; return res }, 0)
                  if (carNum > 0) {
                    wx.setTabBarBadge({
                      index: 2,
                      text: carNum.toString()
                    })
                  }
                  else {
                    wx.removeTabBarBadge({
                      index: 2
                    })
                  }
            }
            else{
              console.log("请先登录！")
            }
          }
        })
      },
      fail:function(e){
        console.log(e)
      }
    })
    
  },
  remove:function(e){
    this.setData({ is_modal_Hidden: false, remove_index: e.target.dataset.item})
  },
  checkboxChange:function(e){
    var index = e.currentTarget.dataset.item
    if (index > -1) {
      this.data.carList[index].checked = !this.data.carList[index].checked
      if (!this.data.carList[index].checked){
        this.setData({checkAll:false,carList:this.data.carList})
      }
      else if(this.data.carList.every(item=>item.checked)){
        this.setData({ checkAll: true, carList: this.data.carList })
      }
      var allCheckedNum = this.data.carList.reduce((res, item) => res += (item.checked ? item.num : 0), 0)
      var allCheckedMoney = this.data.carList.reduce((res, item) => res += (item.checked ? item.price * item.num : 0), 0)
      this.setData({ allCheckedMoney, allCheckedNum }) 
    }
  },
  allCheckboxChange:function(){
    this.data.carList.forEach(item => item.checked = !this.data.checkAll)
    this.setData({ carList: this.data.carList, checkAll: !this.data.checkAll})
    var allCheckedNum = this.data.carList.reduce((res, item) => res += (item.checked ? item.num : 0), 0)
    var allCheckedMoney = this.data.carList.reduce((res, item) => res += (item.checked ? item.price * item.num : 0), 0)
    this.setData({ allCheckedMoney, allCheckedNum }) 
  },
  startMoveItem: function (e) {
    var touches = e.touches[0]
    this.setData({ preX: touches.pageX})  
  },
  endMoveItem: function (e){
    var touches = e.changedTouches[0]
    if (this.data.preX - touches.pageX > 0) {
      var index = e.currentTarget.dataset.item
      if (index > -1) {
        this.data.carList[index].move = true
        this.setData({ carList: this.data.carList})
      }
    }
    else if (this.data.preX - touches.pageX < 0) {
      var index = e.currentTarget.dataset.item
      if (index > -1) {
        this.data.carList[index].move = false
        this.setData({ carList: this.data.carList})
      }
    }
  },
  chooseSpec:function(e){
    var index = e.currentTarget.dataset.item
    var id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: "./detail/index?id=" + id + "&" + "index=" + index,
      error:function(e){
        console.log(e)
      }
    })
  },
  submit:function(e){
  },
  bindGoMi:function(e){
    wx.switchTab({url:"../home/index"})
  },
  modalCancel:function(e){
    if (this.data.remove_index > -1) {
      this.data.carList.splice(this.data.remove_index, 1)
      this.setData({ carList: this.data.carList, "remove_index": -1 })
      wx.setStorageSync("carList", this.data.carList)

      var allCheckedNum = this.data.carList.reduce((res, item) => res += (item.checked ? item.num : 0), 0)
      var allCheckedMoney = this.data.carList.reduce((res, item) => res += (item.checked ? item.price * item.num : 0), 0)
      this.setData({ allCheckedMoney, allCheckedNum })
      //更新导航购物车数量
      var carNum = this.data.carList.reduce((res, item) => { res += item.num; return res }, 0)
      if (carNum > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: carNum.toString(),
        })
      }
      else {
        wx.removeTabBarBadge({
          index: 2
        })
      }
    }
  },
  modalSure:function(e){
    this.data.carList[this.data.remove_index].move = false
    this.setData({ "remove_index": -1, carList: this.data.carList })
    wx.setStorageSync("carList", this.data.carList)
  }
})