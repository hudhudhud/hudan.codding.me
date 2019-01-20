Component({
  externalClasses: ['my-class'],
  properties: {
    rootUrl: {
      type: String,
      value: 'http://47.96.13.204/img/',
    },
    src:{
      type: String,
      value:"",
      observer:function(n,o){
        console.log(this.properties.rootUrl+n)
      }
    },
    "myStyle":{
      type: String,
      value: "",
    }
  },
  data: {
    // 这里是一些组件内部数据  
    text: "text",
  },
  methods: {
  
  }
})  