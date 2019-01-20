var pageInfo={
    data:{
      is_modal_Hidden: true,
      is_modal_Title:"搜索关键字",
      search_val:"",
    
      disabled: true,
      reachBottom:false,
      swiper:{
        "dots":true,
        "color":"rgba(255,255,255,0.5)",
        "activeColor":"rgba(255,255,255,0.8)",
        "autoplay":true,
        "interval":2000,
        "circular":true,
        imgUrls: [
          'a.jpg',
          'b.jpg',
        ],
      },
      proList: []
    },
    onLoad:function(){
      var app = getApp()
      //app.checkLogin()
      app.getProList((proList) => this.setData({ proList }))

      // this.data.swiper.imgUrls=this.data.swiper.imgUrls.map(item => { return app.globalImgUrl + item})
      // this.setData({ swiper: this.data.swiper })

      var carData = wx.getStorageSync("carList") || []
      //更新导航购物车数量
      var carNum = carData.reduce((res, item) => { res += item.num; return res }, 0)
      if(carNum>0){
        wx.setTabBarBadge({
          index:2,
          text: carNum.toString(),
        })
      }
      else{
        wx.removeTabBarBadge({
          index: 2
        })
      }

      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          var latitude = res.latitude // 经度
          var longitude = res.longitude // 纬度
        }
      })
    },
    bindtab: function(){//??用bindfocus手机上为啥会跳进来两次！！用bindtab就可以
      wx.navigateTo({
        url: '../proList/index',
      })
    },
    bindconfirm:function(){
      this.setData({ is_modal_Hidden:false})
    },
    onPullDownRefresh:function(e){
      this.setData({
        reachTop: true
      })
      setTimeout(() => {
        this.setData({
          reachTop: false
        })
      }, 1000)
    },
    onReachBottom:function(){
      this.setData({
        reachBottom:true
      })
      setTimeout(()=>{
        (new Array(4)).fill(1).forEach(()=>{
          this.data.proList.push(this.data.proList[Math.floor(Math.random() * (this.data.proList.length - 1))])
        })
        this.setData({
          proList: this.data.proList,
          reachBottom: false
        })
      },1000)
    },
    goDetail:function(e){
      var id=e.currentTarget.dataset.id
      if(id){
        wx.navigateTo({
          url: '../proDetail/index?id=' + id,
        })
      }
    },
    bindModalInput:function(e){
      this.setData({ search_val:e.detail.value})
    },
    //自定义组件触发的方法
    myevent:function(e){
        console.log("hello",e)
        wx.navigateTo({
          url: '../proList/index?qstr='+this.data.search_val,
        })
    }
};
Page(pageInfo)













/** 引入 tabbar 组件的 init函数
  * init函数封装了 Page函数的所有生命周期函数
 */
// import {
//   init,
//   Tabbar,
//   setTabbarData
// } from "../template/tabbar";

// const UserPageData = {
//   data: {
//     motto: 'Hello World',
//     userInfo: {},
//   },

//   /**
//     * 生命周期函数
//   */
//   onLoad() {
//     let that = this
//     let app = getApp()

//     app.getUserInfo(function (userInfo) {
//       //更新数据
//       that.setData({
//         userInfo: userInfo
//       })
//     })
//   },
//   onReachBottom(ev) {
//     console.log("ReachBottom");
//     this.setData({
//       userInfo: {
//         avatarUrl: this.data.userInfo.avatarUrl,
//         nickName: "ReachBottom"
//       }
//     });
//   },
//   onPullDownRefresh() {
//     this.setData({
//       userInfo: {
//         avatarUrl: this.data.userInfo.avatarUrl,
//         nickName: "PullDown"
//       }
//     });
//     setTimeout(() => {
//       wx.stopPullDownRefresh();
//       console.log("stop");
//     }, 300);
//   },


//   /**
//     * 逻辑绑定
//   */
//   bindViewTap() {
//     console.log("tap");
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
// };

// // tabbar 对象的数据
// const tabbarData = [
//   {
//     iCount: 0,                         //未读数目 Integer
//     sIconUrl: "../img/home.png",     //按钮图标 String
//     sTitle: "home",                     //按钮名称 String
//     sUrl:"/pages/home/index"
//   }
// ];

// // 另一种添加数据的方式
// tabbarData.push({
//   iCount: 1,
//   sIconUrl: "../img/car.png",
//   sTitle: "note",
//   sUrl: "/pages/index/index"
// });


// // 调用 组件的设置函数，传入数据对象
// setTabbarData(tabbarData);

// // 调用已经封装好的启动函数 类似于 原生的Page
// // 已经封装所有的接口
// init(UserPageData);

// // 注册tab被单击时触发的事件
// Tabbar.addListener(function (ev) {
//   wx.reLaunch({
//     "url":ev.data.sUrl,
//     success:function(data){
//       console.log(data);
//     },
//     fail:function(err){
//       console.log(err);
//     }
//   })
  
//   // ev.key === 'note'
//   // ev的key对应被点击的tab的title

// });

