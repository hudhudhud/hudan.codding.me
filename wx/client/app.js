//app.js
App({
  // path, query, scene, shareTicket, referrerInfo
  onLaunch: function (...args) {
    console.log(args)
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    wx.login({
      success:function(res){
        var code=res.code
        var name=""
        if(code){
          console.log('获取用户登录凭证：'+code)
          wx.getUserInfo({
            withCredentials:false,
            success: function (data){
              name = data.userInfo.nickName
              //{errMsg: "getUserInfo:ok", rawData: "{"nickName":"iamabj","gender":2,"language":"zh_CN"…RnSTsMEJtQ792cfuoehcYMxvnhqnkfTZ4DTljg9DZXAzA/0"}", userInfo: {…}, signature: undefined}
              console.log(data)
              wx.request({
                url: "https://iamabj.club/login/wx/loginByWxcode",
                data: { 
                  code: code,
                  userInfo: data.rawData
                   },
                success: function (res) {
                  console.log("return:" + JSON.stringify(res))
                  if(res&&res.data){
                    wx.setStorageSync("session_id",res.data.session_id)
                  }
                },
                fail: function (e) {
                  console.log("error:" +e)
                }
              })
            }
          })
        }
        else{
          console.log('获取用户登录凭证失败:'+res.errMsg)
        }
      }
    })
  },
  onShow: function (...args) {
    console.log(args)
    console.log("show!")
  },
  onHide: function () {
    console.log("hide!")
  },
  onError:function(err){
    console.log("err:"+err)
  },
  globalData: {
    userInfo: null,
    proList: null,
    catgList: null,
    sysInfo: null
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getSysInfo: function (cb){
    if (this.globalData.sysInfo) {
      typeof cb == "function" && cb(this.globalData.sysInfo)
    } else {
      this.globalData.sysInfo = wx.getSystemInfoSync()
      typeof cb == "function" && cb(this.globalData.sysInfo)
    }
  },
  checkLogin:function(){
    // wx.checkSession({
    //   success: function () {
    //     //session 未过期，并且在本生命周期一直有效
    //     console.log("session 未过期，并且在本生命周期一直有效")
    //   },
    //   fail: function () {
        console.log("登录态过期")
        //登录态过期
        wx.login({
          success: function (res){
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://iamabj.club/login',
                data: {
                  code: res.code
                },
                success:function(res){
                  console.log(res)
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        }) //重新登录
    //   }
    // })
  },
  getProList:function(cb){
    if (this.globalData.proList) {
      typeof cb == "function" && cb(this.globalData.proList)
    } else {
      //调用获取产品接口
      var proList = [
        {
          id:1,
          img: 'sb.jpg',
          name: '小米便携鼠标',
          desc: '轻薄便携，含电池仅重77.5g',
          price: 99,
          catg:1,
          maxNum:5,
          detail: {
            imgList: ["proDetail/shubiao.png", "proDetail/shubiao_1.png"],
            desc: '阳极氧化铝合金外壳+ABS材质 / 蓝牙或2.4G双模式 / 轻薄便携',
            spec: [
              { "name": "颜色", "content": [{ "default": true, "val": "银色", "img": "proDetail/sb_1.png" }, { "val": "金色", "img": "proDetail/sb_2.png" }, { "val": "深空灰", "img": "proDetail/sb_3.png" }] },
              { "name": "通用", "content": [{"val": "通用" }] }]
          }
        },
        {
          id:2,
          img: 'hm.png',
          name: '红米Note 5A 高配版',
          desc: '1600万像素柔光自拍',
          price: 899,
          catg: 2,
          maxNum: 5,
          detail: {
            imgList: ["proDetail/pro_1.png", "proDetail/pro_2.png"],
            desc: '搭载了玩游戏超给力的高通骁龙处理器，后置12MP旗舰相机，前置柔光自拍，配备5.7英寸全面屏',
            activity: [{ "title": "赠品", "content": "限量赠保护壳" }, { "title": "赠品", "content": "赠米粉卡"}],
            spec: [
              { "name": "版本", "content": [{ "val": "4GB+32GB", "price": 1099 }, { "val": "3GB+32GB", "price": 999 }, { "default": true, "val": "2GB+16GB", "price": 899 }]},
              { "name": "颜色", "content": [{ "default": true, "val": "黑色", "img": "proDetail/spec_1.jpg" }, { "val": "金色", "img": "proDetail/spec_2.jpg" }, { "val": "玫瑰金", "img": "proDetail/spec_3.jpg" }]}]
          }
        },
        {
          id:3,
          img: 'sh.jpg',
          name: 'Amazfit Cor手环',
          desc: '大屏一目了然',
          price: 299,
          catg: 1,
          maxNum: 5,
          detail: {
            imgList: ["proDetail/xmsh.jpg", "proDetail/xmsh_1.jpg"],
            desc: '彩色IPS触摸屏 / 50米游泳防水 / 支付宝离线支付 / 大屏一目了然',
            spec: [
              { "name": "颜色", 
                "content": [{ "default": true, "val": "猎豹黑", "img": "proDetail/sh.jpg", price: 299}, 
                  { "val": "海豚灰", "img": "proDetail/sh_1.jpg",price:329 }] 
              },
              { "name": "通用", "content": [{"val": "通用" }] }
              ]
          }
        },
        {
          id:4,
          img: 'cz.jpg',
          name: '米家智能插座',
          desc: '温控感应',
          price: 59,
          catg: 1,
          maxNum: 5,
          detail: {
            imgList: ["proDetail/cz1.jpg", "proDetail/cz2.jpg"],
            desc: '温控感应 / 独立安全门 / 750℃阻燃 / 3C安全认证​手机',
            spec: [
                { "name": "颜色", "content": [{ "default": true, "val": "白色", "img": "proDetail/cz_11.jpg" }]},
                { "name": "通用", "content": [{ "val": "通用"}] }
              ]
          }
        },
        {
          id:5,
          img: 'tv.jpg',
          name: '小米电视4 49英寸',
          desc: '极超薄高端旗舰电视',
          price: 3399,
          catg: 3,
          maxNum: 5,
          detail: {
            imgList: ["proDetail/tv_1.jpg", "proDetail/tv_2.jpg"],
            desc: '4.9mm 极超薄机身 / 无边框式设计 / 2GB+8GB大内存',
            spec: [
              { "name": "尺寸版本", "content": [{ "val": "49英寸" }] },
              { "name": "颜色", "content": [{ "default": true, "val": "灰色", "img": "proDetail/tv_11.jpg" }] }]
          }
        },
        {
          id: 6,
          img: 'cp.jpg',
          name: '13.3"笔记本i7 独显',
          desc: '2G独显',
          price: 5999,
          catg: 4,
          maxNum: 2,
          detail: {
            imgList: ["proDetail/pc.jpg"],
            desc: '2G独显 / 8GB 内存 + 256GB SSD / 第七代 Intel 酷睿i7 处理器 / FHD 全贴合屏幕 / 指纹解锁',
            spec: [
              { "name": "通用", "content": [{ "val": "通用" }] },
              { "name": "颜色", "content": [{ "val": "银色", "img": "proDetail/pc_11.jpg" }] }]
          }
        },
      ]

      this.globalData.proList = proList
      typeof cb == "function" && cb(this.globalData.proList)
    }
  },
  getCatgList:function(cb){
    if (this.globalData.catgList) {
      typeof cb == "function" && cb(this.globalData.catgList)
    } else {
      //调用获取产品接口
    var catgList=[
      { id: 1, name: "新品", img: 'advice_1.jpg'}, 
      { id: 2, name: "手机", img: 'advice_2.jpg'}, 
      { id: 3, name: "电视", img: 'advice_3.jpg'}, 
      { id: 4, name: "电脑", img: 'advice_4.jpg' },
      { id: 5, name: "家电", img: 'advice_5.jpg' }, 
      { id: 6, name: "路由", img: 'advice_6.jpg' },
      { id: 7, name: "智能", img: 'advice_7.jpg' }, 
      { id: 8, name: "儿童", img: 'advice_8.jpg' }, 
      { id: 9, name: "电源", img: 'advice_9.jpg' }, 
      { id: 10, name: "耳机", img: 'advice_10.jpg' }, 
      { id: 11, name: "音响", img: 'advice_11.jpg' }, 
      { id: 12, name: "礼品", img: 'advice_12.jpg' }, 
      { id: 13, name: "生活", img: 'advice_13.jpg' }, 
      { id: 14, name: "服务", img: 'advice_14.jpg' }, 
      { id: 15, name: "米粉卡", img: 'advice_15.jpg' }
    ]
    this.globalData.catgList = catgList
    typeof cb == "function" && cb(this.globalData.catgList)
  }
  },
  getProById:function(id){
      var pro=null
      this.getProList((proList)=>{
        pro=proList.find(item=>item.id==id)
      })
      return pro
  },
  isEqual:function(obj1,obj2){
    var hasOwnProperty = Object.prototype.hasOwnProperty
    var typeObj1 = Object.prototype.toString.call(obj1)
    var typeObj2 =Object.prototype.toString.call(obj2)
    if(typeObj1==typeObj2){
      if (typeObj1 != "[object Object]" && typeObj1 != "[object Array]"){
         return obj1==obj2
      }
      else{
        if (Object.keys(obj1).length != Object.keys(obj2).length)
          return false
        for(var key in obj1){
          if (obj1.hasOwnProperty(key)){
            if (obj2.hasOwnProperty(key)){
              var res=this.isEqual(obj1[key], obj2[key])
              if(!res)return false
            }
          }
        }
        return true
      }
    }
    else return false
  }
})

