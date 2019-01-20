Component({
  properties: {
     //这里定义了modalHidden属性，属性值可以在组件使用时指定.写法为modal-hidden  
    modalHidden: {
      type: Boolean,
      value: true
    },
    modalMsg: {
      type: String,
      value: '',
      observer:function(n,o){
        console.log("text changed",n,o)
      }
    },
    modalTitle:{
      type: String,
      value: '提示'
    },
    modalSureMsg:{
      type: String,
      value: '确定'
    },
    modalCancelMsg: {
      type: String,
      value: '取消'
    }
  },
  data: {
    // 这里是一些组件内部数据  
    text: "text",
  },
  methods: {
    // 这里放置自定义方法  
    modal_click_Hidden: function (e) {
      this.triggerEvent('modalCancel', e)
      this.setData({
        modalHidden: true,
      })
    },
    // 确定  
    Sure: function (e) {
      this.triggerEvent('modalSure', e)
      this.setData({
        modalHidden: true,
      })
    }
  }
})  