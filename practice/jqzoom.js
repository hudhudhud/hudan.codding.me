class jqzoom{
  constructor(ele,opt){
      this.ele=ele
      this.options={
          zoom:2,
          position:"right",
          smlSize:400,
          bigSize:400,
          hid:false,
      }
      if(opt){
        Object.assign(this.options,opt)
      }
      if(this.options.position=="right"){
        this.bigcss={"left":this.options.smlSize}
        this.smlcss={"left":0}
      }
      else if(this.options.position=="top"){
        this.bigcss={"top":0}
        this.smlcss={"top":this.options.smlSize}
      }
      else if(this.options.position=="left"){
        this.bigcss={"left":0}
        this.smlcss={"left":this.options.smlSize}
      }
      else if(this.options.position=="bottom"){
        this.bigcss={"top":this.options.smlSize}
        this.smlcss={"top":0}
      }
      this.small=$(
        `<div id="small">
          <img src="${this.options.fromSrc}"/>
        </div>`)
      this.small.css(Object.assign({
        width:this.options.smlSize+"px",
        height:this.options.smlSize+"px",
        "position":"absolute"
      },this.smlcss))

      this.mask=$(`<div id="mask"></div>`)
      /*标记方块maskSize与大图的bigSize比例必须等于大图的放大比例,在此为2*/
      var maskSize=this.options.smlSize/(this.options.zoom*this.options.bigSize/this.options.smlSize)+"px"
      this.mask.css({
        width:maskSize,
        height:maskSize
      })
      this.small.append(this.mask)
      this.big=$(
        `<div id="big">
           <img src="${this.options.toSrc}"/>
        </div>`)
      this.big.css(Object.assign({
        width:this.options.bigSize+"px",
        height:this.options.bigSize+"px",
        "position":"absolute"
      },this.bigcss))

      if(this.options.hid){
        this.hid=$(`<div id="hid"></div>`)
        this.big.append(this.hid)
        this.big.css({
          position: 'relative',
          //'margin':'500px',
        })
        this.hid.css({
           width:this.options.zoom*100+"%",
           height:this.options.zoom*100+"%",
        })
      }
      else{
        this.big.css({
          overflow:"hidden"
        })
      }
      this.ele.html("")
      this.ele.append(this.small).append(this.big)

      this.big_img=this.big.children("img")
      this.big_img.css({
        width:this.options.zoom*100+"%",
        height:this.options.zoom*100+"%",
      })
     
      this.small.on("mousemove",this.hover.bind(this))
      this.small.on("mouseout",this.hoverout.bind(this))
  }
  hover(e) {
    this.mask.show()
    this.big.show()
    var marginL=this.small.offset().left
    var marginT=this.small.offset().top
    var currentX= e.clientX
    var currentY= e.clientY
    var x=currentX-marginL-this.mask.width()/2
    var y=currentY-marginT-this.mask.height()/2

    //闲置焦点框的位置的移动 
    //上一步执行完成后焦点框的移动是不受任何闲置的，在我们浏览购物网站的过程中，明显可以感受到焦点框不容许移动的小图的外面，造成不好的用户体验； 
    //要限制焦点框的移动，主要是x，y变化超过容许值时，给他一个固定的值； 
    if(x<0){x=0}
    if(x>this.small.width()-this.mask.width()){
      x=this.small.width()-this.mask.width()
    }
    if(y<0){y=0}
    if(y>this.small.height()-this.mask.height()){
      y=this.small.height()-this.mask.height()
    }
    this.mask.css({
      left:x+"px",
      top:y+"px"
    })

    //设置大图的显示 
    //在big盒子中实现图片的移动，应该想到-margin值； 
    //移动多少距离可以利用一个固定比例乘以mask的left和top值，想一下焦点区的左上角和大图框的左上角显示的位置是相同的！！！这一点就不是很难理解了
    var relativeX=this.mask.offset().left-(this.smlcss.left || 0)
    var relativeY=this.mask.offset().top-(this.smlcss.top || 0)
    var width=this.mask.width()
    var height=this.mask.height()
    var proporationX=this.big_img.width()/this.small.width()
    var proporationY=this.big_img.height()/this.small.height()
    this.big_img.css({
      'margin-left':function(){
        return (-relativeX)*proporationX+"px"
      },
      'margin-top':function(){
        return (-relativeY)*proporationY+"px"
      },
    })
  }
  hoverout(e){
    this.mask.hide()
    this.big.hide()
  }
}