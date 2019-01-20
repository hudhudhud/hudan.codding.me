 class Slider3D {
   constructor() {
     this.index = 0
     this.firstClick = true
     this.timeId = setInterval(this.nextImg.bind(this), 2000)
     this.liList = Array.from(document.getElementsByClassName("imgList")[0].getElementsByTagName("ul")[0].getElementsByTagName("li"))
     this.lineList = []
     this.length = this.liList.length - 1
     if (this.length < 3) {
       throw Error("图片数量至少3张！")
       return
     }
     this.classList = new Array(this.length + 1).fill(1).map((item, i) => "list0" + (i + 1))
     this.init()
   }
   init() {
     Array.from(this.liList).forEach((item, i) => {
       item.setAttribute("class", this.classList[i])
     })

     var div = document.createElement("div")
     div.setAttribute("class", "line")
     this.liList.forEach((item, i) => {
       var a = document.createElement("a")
       a.setAttribute("class", i == 0 ? "current-line" : "normal-line")
       this.lineList.push(a)
       div.appendChild(a)
     })
     var slider = document.getElementsByClassName("slider3D")[0]
     slider.appendChild(div)

     this.detailClass = this.classList.map((item, i) => {
       var zIndex = 0
       if (i == 1)
         zIndex = 1
       else if (i > 2)
         zIndex = -i
       return `.slider3D .${item}{transform: translate(${140*i}px,0) ${i==1?"":"scale(0.9)"};
                          transform-origin: ${i==0?"0":"100%"} 100%;
                          z-index:${zIndex};
                          ${i==1?"":"filter:grayscale(80%) blur(3px);"}
                        }`

     })

     document.getElementsByTagName("style")[0].innerText += this.detailClass.join("")
     document.addEventListener("click", this.onClick.bind(this))
     document.addEventListener("keydown", this.keydown.bind(this))

     document.getElementsByClassName("slider3D")[0].addEventListener("mouseout", () => {
       this.timeId = setInterval(this.nextImg.bind(this), 2000)
     })
     document.getElementsByClassName("slider3D")[0].addEventListener("mouseover", () => {
       clearInterval(this.timeId)
     })
   }
   nextImg() {
     if (this.firstClick) {
       document.getElementsByTagName("style")[0].innerText += ".slider3D .imgList li{transition: transform 0.2s ease;}"
       this.firstClick = false
     }
     if (this.index == this.length) {
       this.index = 0
     } else {
       this.index++
     }
     this.classList.unshift(this.classList[this.length])
     this.classList.pop();
     [].slice.call(this.liList).forEach((item, i) => {
       item.setAttribute("class", this.classList[i])
       this.lineList[i].setAttribute("class", "normal-line")
     })
     this.lineList[this.index].setAttribute("class", "current-line")
   }
   prevImg() {
     if (this.firstClick) {
       document.getElementsByTagName("style")[0].innerText += ".slider3D .imgList li{transition: transform 0.2s ease;}"
       this.firstClick = false
     }
     if (this.index == 0) {
       this.index = this.length
     } else {
       this.index--
     }
     this.classList.push(this.classList[0])
     this.classList.shift();
     [].slice.call(this.liList).forEach((item, i) => {
       item.setAttribute("class", this.classList[i])
       this.lineList[i].setAttribute("class", "normal-line")
     })
     this.lineList[this.index].setAttribute("class", "current-line")
   }
   onClick(e) {
     let el = e.target.parentNode.parentNode
     if (el && el.className.indexOf("list") > -1) {
       var className = el.getAttribute("class")
       if (className == "list01") {
         this.prevImg()
       } else if (className == "list03") {
         this.nextImg()
       }
     } else {
       Array.from(this.lineList).forEach((item, key) => {
         if (e.target === item) {
           var newIndex = +key
           while (newIndex > this.index) {
             this.nextImg()
           }
           while (newIndex < this.index) {
             this.prevImg()
           }
         }
       })
     }
   }
   keydown(e) {
     if (e.key == "ArrowLeft") {
       this.prevImg()
       clearInterval(this.timeId)
     }
     if (e.key == "ArrowRight") {
       this.nextImg()
       clearInterval(this.timeId)
     }
   }
 }