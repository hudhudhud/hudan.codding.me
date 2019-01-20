class Slider {
  constructor(selector, config) {
    if (new.target != Slider)
      return new Slider(selector, obj)
    this.ele = $(selector)
    this.ele.slider = this
    this.eventHandlers = {
      beforePaly: [],
      beforeNext: [],
    }

    this.ele.addClass("slider")
    this.config = {
      "width": 500,
      "height": 400,
      "autoPlay": true,
      "duration": 2000,
    }
    if (config != undefined) {
      for (let con in config) {
        if (con in this.config) {
          this.config[con] = config[con]
        }
      }
    }

    var self = this
    this.imgs = self.ele.find("img")
    this.imgCount = this.imgs.length
    self.ele.css({
      width: this.config.width,
      height: this.config.height
    })

    $(`<span class="prev"></span>
        <span class="next"></span>
        <div class="dots"></div>`).prependTo(this.ele)
    this.dots = this.ele.find(".dots")
    this.imgs.first().toggleClass("show")
    this.imgs.each(function(index) {
      self.dots.append(`<span class='dot'></span>`)
    })
    this.dots.find(".dot").first().addClass("current-dot")
    this.ele.on("click", ".dot", function() {
      self.imgs.removeClass("show")
      self.imgs.eq(`${$(this).index()}`).toggleClass("show")
      $(this).addClass("current-dot").siblings(".dot").removeClass("current-dot")
    })
    self.ele.on("click", ".prev,.next", function() {
      var current = self.imgs.filter(".show")
      current.toggleClass("show")
      var target = current.next("img").length ? current.next("img") : self.imgs.first()
      if (this.className == "prev") {
        target = current.prev("img").length ? current.prev("img") : self.imgs.last()
      }
      target.toggleClass("show")
      self.changeDotCurrent()
    })

    this.play()
    self.ele.hover(
      self.stop.bind(self),
      function() {
        self.stop()
        self.play()
      }
    )
  }
  play() {
    if (this.eventHandlers["beforePaly"].length > 0)
      this.trigger("beforePaly")
    if (this.config.autoPlay) {
      this.autoPlayId = setInterval(() => {
        //$(".next").click()
        this.next()
      }, this.config.duration)
    } else this.stop()
  }
  stop() {
    if (this.autoPlayId)
      clearInterval(this.autoPlayId)
  }
  changeDotCurrent() {
    this.dots.find(".dot").removeClass("current-dot")
    var index = this.ele.find("img.show").index(".slider img")
    this.dots.find(".dot").eq(index).addClass("current-dot")
  }
  set(key, value) {
    this.config[key] = value
    if (key == "autoPlay" || key == "duration") {
      this.stop()
      if (this.config.autoPlay) this.play()
    } else {
      if (key == "width")
        this.ele.width(value)
      if (key == "height")
        this.ele.height(value)
    }
  }
  next() {
    if (this.eventHandlers["beforeNext"].length > 0)
      this.trigger("beforeNext")
    this.ele.find(".next").click()
  }
  prev(key, value) {
    this.ele.find(".prev").click()
  }
  add(url) {
    this.ele.append(`<img src='${url}'>`)
    this.dots.append(`<span class='dot'></span>`)
    this.imgs = this.ele.find("img")
    this.imgCount = this.imgs.length
  }
  remove(index = this.imgCount) {
    index = index - 1
    var target = this.ele.find("img").eq(index)
    if (target.length) {
      target[0].remove()
      this.dots.find(".dot").eq(index)[0].remove()
      this.imgs = this.ele.find("img")
      this.imgCount = this.imgs.length
    }
  }
  on(event, fn) {
    this.eventHandlers[event].push(fn)
  }
  trigger(event, ...args) {
    this.eventHandlers[event].forEach(handles => handles(...args))
  }
}