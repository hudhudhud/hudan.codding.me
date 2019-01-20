var searchBar={
  "searchValue": "",
  "autoFocus":false,
  "disabled":true,
  "bindKeyInput": function (e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    if (pos != -1) {
      //光标在中间
      var left = e.detail.value.slice(0, pos)
      //计算光标的位置
      pos = left.replace(/11/g, '2').length
    }
    this.setData({
      "searchValue": value.replace(/11/g, '2')
    })
  },
  "bindClear": function (e) {
    this.setData({
      "searchValue": ""
    })
  },
}
module.exports.searchBar = searchBar
