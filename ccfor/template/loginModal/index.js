var topNavbarTemp = {
  modal_Title: "登录",
  is_modal_Hidden: true,
  "onLoad":function(){
    var width=0
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.selectAll('.topbar').boundingClientRect()
    query.exec(res=> {
      //res就是 所有标签为mjltest的元素的信息 的数组
      console.log(res);
      res[0].forEach((item)=>{width+=item.width})
      if ((this.data.catgs.length >5)) {
        this.setData({ barDis: 100 / (this.data.catgs.length + 3) +'%' })
      } else {
        this.setData({ barDis: `calc((100% - ${width}px) / ${this.data.catgs.length-1})` })
      }
    })
    console.log("topbar加载中")
  },
  "tapCatg": function (e) {
    if (e) {
      this.setData({ catgIndex: e.currentTarget.dataset.catg })
    }
    var catgModel = this.data.catgs[this.data.catgIndex]
    this.setData({ left: - this.data.catgIndex * 100 })
    this.setData({ catgs: this.data.catgs })
  },
}
module.exports.topNavbarTemp = topNavbarTemp


