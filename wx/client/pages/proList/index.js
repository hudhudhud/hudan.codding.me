import {
  searchBar
} from "../template/searchBar";
var pageInfo = {
  data: {//data 将会以 JSON 的形式由逻辑层传至渲染层，所以其数据必须是可以转成 JSON 的格式：字符串，数字，布尔值，对象，数组。所以data里面不可以放表达式
    "searchValue": "",
    "autoFocus": true,
    "noSearch":true,
    "lastShowInputTime":0,
    "reachBottom":false,
    proList:[],
    showList:[],
    searchList:["红米","鼠标","note","小米笔记本"],
    searchHistory: [],
    showInputList:[]
  },
  onLoad:function(queryStr){
      getApp().getProList((proList) => this.setData({ proList }))
      this.data.proList.forEach(item => {
        item.detail.desc = item.detail.desc.substr(0, 32)
      })
      this.setData({
        showList: this.data.proList,
        searchHistory: wx.getStorageSync("searchHistory") || []
      })
      if (queryStr.qstr) {
        this.bindconfirm(null, queryStr.qstr)
        this.setData({ "autoFocus": false})
      }
  },
  bindKeyInput: function(e){
    this.setData({
      showInputList: [],
      showList:[],
      noSearch: true,
    })
    if (!e.detail.value)return
    var value = e.detail.value
    var searchTime=Date.now()
    if (searchTime>this.data.lastShowInputTime){
      this.data.proList.forEach(item => {
        if (item.name.indexOf(value) > -1) {
          this.data.showInputList.push(item)
        }
      })
      this.data.lastShowInputTime=Date.now()
      this.setData({
        searchValue: value,
        showInputList: this.data.showInputList,
        lastShowInputTime: this.data.lastShowInputTime
      })
    }
  },
  bindClear: function(){
    searchBar.bindClear.bind(this)()
    this.setData({
      noSearch: true,
      showInputList:[]
    })
  },
  bindconfirm:function(e,str){
    var querystr = e?e.target.dataset.key:str
    if (querystr){
      this.setData({
        searchValue: querystr
      })
    }
    var searchValue = this.data.searchValue.trim()
    if (searchValue){
      if (!this.data.searchHistory.includes(searchValue)){
        this.data.searchHistory.push(searchValue)
        this.setData({
          searchHistory: this.data.searchHistory
        })
        wx.setStorageSync("searchHistory", this.data.searchHistory)
      }
    }
    this.data.showList = []
    wx.showLoading({
      title: '请等待...',
      mask: true,
      success: () => {
        setTimeout(()=>{
          this.data.proList.forEach(item => {
            if (item.name.indexOf(this.data.searchValue) > -1) {
              this.data.showList.push(item)
            }
          })
          this.setData({
            showList: this.data.showList,
            noSearch:false,
            showInputList:[]
          })
          wx.hideLoading()
        }, 1000)
      }
    })
  },
  bindClearHistory:function(){
    this.setData({
      searchHistory:[]
    })
    wx.removeStorageSync("searchHistory")
    wx.removeStorageSync("searchHistory")
  },
  goDetail:function(e) {
    var id = e.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({
        url: '../proDetail/index?id=' + id,
      })
    }
  },
  onReachBottom: function (e) {
    this.setData({
      reachBottom: true
    })
    // setTimeout(() => {
    //   this.setData({
    //     reachBottom: false
    //   })
    // }, 1000)
  }
};
Page(pageInfo)