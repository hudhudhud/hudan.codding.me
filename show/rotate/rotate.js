(function($) {
  $.fn.knob = function(config = {}) {
    $(this).append(
      `<div class="knob">
        <section class="nei">
          <div class="move"></div>
        </section>
      </div>`)

    let knob = $(".knob")
    let move = knob.find(".move")
    let nei = knob.find(".nei")

    let centerx, centery, startDeg = -1,
      rotation = 0,
      current = 0,
      lastDeg = 0
    let begin = false

    let initConfig = $.extend({
      from: 0,
      to: 359,
      value: 0,
      turn: function() {},
      begin: function() {},
      end: function() {},
    }, config)

    Object.defineProperty(initConfig, "start", {
      get: function() {
        return this.value
      },
      set: function(val) {
        this.value = val
        $(nei).css('transform', 'rotate(' + val + 'deg)')
      }
    })

    // for(val of Object.keys(config)){
    //   if(Object.prototype.hasOwnProperty.call(initConfig,val)){
    //     initConfig[val]=config[val]
    //   }
    // }

    if (initConfig.start && initConfig.start != 0) {
      $(nei).css('transform', 'rotate(' + initConfig.start + 'deg)')
      initConfig.turn(initConfig.start)
    }

    knob.on("mousedown touchstart", function(e) {
      initConfig.begin()

      let rect = $(this).offset()
      centerx = rect.left + $(this).width() / 2
      centery = rect.top + $(this).height() / 2
      begin = true

      knob.on("mousemove.a touchmove.a", (e) => {

        e = e.touches ? e.touches[0] : e
        if (begin) {
          $(move).addClass("cursor")
          newleft = centerx - e.pageX
          newtop = centery - e.pageY

          //计算鼠标点击位置到原点的弧度
          let m = Math.atan2(newtop, newleft) * (180 / Math.PI)

          //保存刚开始点击的位置
          if (startDeg == -1) {
            startDeg = m
          }
          current = Math.floor(m - startDeg + rotation)

          if (current < 0) {
            current = 360 + current
          }

          if (current > 359) {
            current = current % 360
          }

          if (Math.abs(current - lastDeg) > 180) { //如果当前与上次相差大于180，说明为0deg的点
            current = 0
          }

          if (current < initConfig.from) {
            current = initConfig.from
          }
          if (current > initConfig.to)
            current = initConfig.to

          lastDeg = current
          $(nei).css('transform', 'rotate(' + current + 'deg)')
          initConfig.turn(current)

        }
      })
      knob.on("mouseup.a touchend.a", (e) => {
        initConfig.end()
        knob.off(".a")
        rotation = current
        startDeg = -1
        begin = false
      })

    })
    return initConfig
  }
})(jQuery)