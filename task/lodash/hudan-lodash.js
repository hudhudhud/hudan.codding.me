var hudan = {
  /**
   * function(array,[size=1])  把数组按尺寸长度分成多个数组
   * @param {Array} [array] [输入数组]
   * @param {number} [size] [分组宽度]
   * @return {Array} [分组后的数组]
   */
  chunk: function(array, size = 1) {
    //size=size===undefined?1:size
    // size=size||1
    var newArray = []
    var tempArray = []
    for (var i = 0; i < array.length; i++) {
      if (i == 0 || i % size != 0) {
        tempArray.push(array[i])
        continue
      }
      newArray.push(tempArray)
      tempArray = []
      tempArray.push(array[i])
    }
    if (tempArray.length > 0) {
      newArray.push(tempArray)
    }
    return newArray
  },
  chunk2: function(array, size = 1) {
    if (size == 0)
      return array
    var result = new Array(Math.ceil(array.length / size)) //确定新数组的长度
      //result.fill([]) fill不能传对象，否则所有值都指向一个对象，都会发生变化
    for (var i = 0; i < result.length; i++) {
      result[i] = []
    }
    for (var i = 0; i < array.length; i++) { //利用规律确定每个值在数组中的坐标，依次填入即可
      result[parseInt(i / size)][i % size] = array[i]
    }
    return result
  },
  /**
   *筛选出数组中为true的项
   * @param {Array} [array] [输入数组]
   * @return {Array} [新的数组]
   **/
  compact: function(array) {
    var newArray = []
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        newArray.push(array[i])
      }
    }
    return newArray
  },
  /**
   *选出左边数组中在右边数组中不存在的项
   * @param {Array} [array1] [输入数组]
   * @param {Array} [array2] [比较数组]
   * @return {Array} [新的数组]
   **/
  difference: function(array1, array2) {
    var newArray = []
    var isExists = false
    for (var i = 0; i < array1.length; i++) {
      isExists = false
      for (var j = 0; j < array2.length; j++) {
        if (array1[i] == array2[j]) {
          isExists = true
          break
        }
      }
      if (!isExists) {
        newArray.push(array1[i])
      }
    }
    return newArray
  },
  /**
   *从给定的数组中，从起始项开始删除n项
   * @param {Array} [array1] [输入数组]
   * @param {number} [n] [删除项数]
   * @return {Array} [新的数组]
   **/
  drop: function(array, n) {
    n = n === undefined ? 1 : n
    if (n > 0) {
      array.splice(0, n)
    }
    return array
  },
  /**
   * [根据字符填充数组]
   * @param  {[Array]} array [需要填充的数组]
   * @param  {[String]} value [填充的字符]
   * @param  {number} start [填充开始位置]
   * @param  {[number]} end   [填充结束位置，不包括该位置]
   * @return {[Array]}       [填充之后的数组]
   */
  fill: function(array, value, start = 0, end = array.length) {
    for (var i = start; i < end; i++) {
      array[i] = value
    }
    return array
  },
  /**
   * [findIndexCommon 查找对象数组对应内容的位置公共类]
   * @param  {[array]} array        [查找的数组对象]
   * @param  {[function]} predicate    [匹配函数]
   * @param  {[function]} forFindIndex [检索开始位置函数]
   * @return {[number]}              [查找到的位置]
   */
  findIndexCommon1: function(array, predicate, forFindIndex) {
    var type = typeof predicate
    switch (type) {
      case "function":
        return forFindIndex(array, x => predicate(x))
      case "object":
        var f = function(x) {
          var isOk = true
          for (var key in x) { //判断输入为对象数组的情况
            if (predicate[key] !== x[key]) {
              isOk = false
              break
            }
          }
          if (isOk)
            return true
          if (predicate[0] !== undefined && x[predicate[0]] === predicate[1]) //判断输入为数组的情况
            return true

          return false
        }
        return forFindIndex(array, f)
      case "string":
        return forFindIndex(array, x => x[predicate])
      default:
        return -1
    }
  },
  findIndexCommon: function(array, predicate, forFindIndex) {
    var type = toString.call(predicate)
    switch (type) {
      case "[object Object]":
        return forFindIndex(array, hudan.matches(predicate))
      case "[object Array]":
        var res = -1
        for (var i = 0; i < predicate.length; i += 2) { //为偶数个数组项匹配对象
          res = forFindIndex(array, hudan.matchesProperty(predicate[i], predicate[i + 1]))
        }
        return res
      case "[object String]":
        return forFindIndex(array, hudan.property(predicate))
      case "[object Function]":
        return forFindIndex(array, predicate)
      default:
        return -1
    }
    return -1
  },
  /**
   * [findIndex 从第一位开始查找对象数组对应内容的位置]
   * @param  {[array]} array        [查找的数组对象]
   * @param  {[function]} predicate    [匹配函数]
   * @param  {[number]} fromIndex [检索开始位置]
   * @return {[number]}              [查找到的位置]
   */
  findIndex: function(array, predicate, fromIndex = 0) {
    var forFindIndex = function(array, f) {
      for (var i = fromIndex; i < array.length; i++) {
        if (f(array[i]))
          return i
      }
      return -1
    }
    return hudan.findIndexCommon(array, predicate, forFindIndex)
  },
  /**
   * [findIndex 从最后开始查找对象数组对应内容的位置]
   * @param  {[array]} array        [查找的数组对象]
   * @param  {[function]} predicate    [匹配函数]
   * @param  {[number]} fromIndex [检索开始位置]
   * @return {[number]}              [查找到的位置]
   */
  findLastIndex: function(array, predicate, fromIndex = array.length - 1) {
    var forFindIndex = function(array, f) {
      for (var i = fromIndex; i > -1; i--) {
        if (f(array[i]))
          return i
      }
      return -1
    }
    return hudan.findIndexCommon(array, predicate, forFindIndex)
  },

  /**
   * [把数组减小一个维度]
   * @param  {[array]} array [传入数组]
   * @return {[array]}       [返回新数组]
   */
  flatten: function(array) {
    var newArray = []
    for (var i = 0; i < array.length; i++) {
      if (typeof array[i] === "object") {
        for (var j = 0; j < array[i].length; j++) {
          newArray.push(array[i][j])
        }
      } else {
        newArray.push(array[i])
      }
    }
    return newArray
  },
  //用reduce实现
  flatten1: function(array) {
    return array.reduce(function(res, value) {
      return res.concat(value)
    }, [])
  },
  //用胖箭头写
  flatten2: array => array.reduce((res, value) => res.concat(value), []),
  flatten3: array => [].concat(...array),
  flatten4: array => [].concat.apply(null, array), //不支持es6时
  flatten5: array => Function.apply.bind([].concat, [])(array),
  /**
   * [把数组变成一维数组]
   * @param  {[array]} array [传入数组]
   * @return {[array]}       [返回一维数组]
   */
  flattenDeep: function flattenDeep(array) {
    var newArray = []
    for (var i = 0; i < array.length; i++) {
      if (typeof array[i] === "object") {
        newArray = newArray.concat(flattenDeep(array[i]))
      } else {
        newArray.push(array[i])
      }
    }
    return newArray
  },
  flattenDeep1: function flattenDeep1(array) {
    return array.reduce(function(res, val) {
      if (Array.isArray(val)) {
        return res.concat(flattenDeep1(val))
      } else {
        return res.concat(val)
      }
    }, [])
  },
  flattenDeep2: array => array.reduce((res, val) => Array.isArray(val) ? res.concat(hudan.flattenDeep2(val)) : res.concat(val), []),

  flattenDepth: function flattenDepth(array, depth = 1) {
    if (depth == 0) {
      return array
    }
    return array.reduce(function(res, val) {
      if (Array.isArray(val)) {
        return res.concat(flattenDepth(val, depth - 1))
      } else {
        return res.concat(val)
      }
    }, [])
  },
  flattenDepth1: (array, depth = 1) => depth == 0 ? array : array.reduce((res, val) => Array.isArray(val) ? res.concat(hudan.flattenDepth1(val, depth - 1)) : res.concat(val), []),
  /**
   * [把键值对数组转换成对象]
   * @param  {[array]} array [键值对数组]
   * @return {[Object]}       [对象]
   */
  fromPairs: function(array) {
    var result = {}
    for (var i = 0; i < array.length; i++) {
      if (array[i].length == 2) {
        result[array[i][0]] = array[i][1]
      }
    }
    return result
  },
  /**
   * [获取数组第一项]
   * @param  {[array]} array [查询数组]
   * @return {[*]}       [数组第一项值]
   */
  head: function(array) {
    return array[0]
  },
  /**
   * [查找数组中某一项，返回索引号，否则返回-1]
   * @param  {[array]} array      [查询数组]
   * @param  {[*]} value          [查询值]
   * @param  {Number} fromIndex   [开始检索项]
   * @return {[Number]}           [索引]
   */
  indexOf: function(array, value, fromIndex = 0) {
    for (var i = fromIndex; i < array.length; i++) {
      if (array[i] == value) {
        return i
      }
    }
    return -1
  },
  /**
   * [去掉数组最后一项]
   * @param  {[array]} array [查询数组]
   * @return {[array]}       [新数组]
   */
  initial: function(array) {
    array.splice(array.length - 1, 1)
    return array
  },
  /**
   * [求两个数组的交集项]
   * @param  {...[array]} arrays [查询数组]
   * @return {[array]}           [返回交集项]
   */
  intersection: function intersection(...arrays) { //:后为表达式，函数名只能在该函数内部使用
    var theSame = []
    if (arrays.length == 2) {
      for (var i = 0; i < arrays[0].length; i++) {
        if (hudan.indexOf(arrays[1], arrays[0][i]) > -1) {
          theSame.push(arrays[0][i])
        }
      }
      return theSame
    } else {
      theSame = theSame.concat(arrays[0]) //取出一个与剩下的比
      arrays.splice(0, 1) //去掉这个
      return intersection(theSame, intersection(...arrays))
    }
  },
  /**
   * [返回数组的最后一项]
   * @param  {[array]} array [查询数组]
   * @return {[array]}       [返回最后一项]
   */
  last: function(array) {
    return array[array.length - 1]
  },
  /**
   * [从右开始找数组中某一项值第一次出现的索引]
   * @param  {[array]} array      [查询数组]
   * @param  {[*]} value          [要查找的项值]
   * @param  {[number]} fromIndex [开始找的索引]
   * @return {[number]}           [返回的索引]
   */
  lastIndexOf: function(array, value, fromIndex = array.length - 1) {
    for (var i = fromIndex; i > -1; i--) {
      if (array[i] == value) {
        return i
      }
    }
    return -1
  },
  /**
   * [从数组中去除所给的值]
   * @param  {[array]}    array  [查询数组]
   * @param  {...[*]} values [要移除的项]
   * @return {[array]}           [返回移除之后的数组]
   */
  pull: function(array, ...values) {
    for (var i = 0; i < array.length; i++) {
      if (hudan.indexOf(values, array[i]) > -1) {
        array.splice(i, 1)
        i--
      }
    }
    return array
  },
  /**
   * [给定值，若放入排好序的数组，最小放到哪个位置]
   * @param  {[array]} array  [数组]
   * @param  {[*]} value      [给定的值]
   * @return {[number]}       [最小的索引]
   */
  sortedIndex: function(array, value) {
    var len = array.length
    var left = 0
    var right = len - 1
    var insertIndex
    while (left <= right) { //叠加了即可返还
      insertIndex = parseInt((right + left) / 2)
      if (value <= array[insertIndex]) { //当给定值小于等于中间值，取左边数组进行比较
        right = insertIndex - 1
      } else if (value > array[insertIndex]) { //当给定值大于中间值，取右边数组进行比较
        left = insertIndex + 1
        insertIndex++
      }
    }
    return insertIndex
  },
  /**
   * [合并数组并去掉重复项]
   * @param  {...[array]} arrays [多组数组]
   * @return {[array]}            [合并之后的数组]
   */
  union: function(...arrays) {
    var newArray = []
    for (var i = 0; i < arrays.length; i++) {
      var tempArray = newArray.concat(arrays[i])
      for (var j = 0; j < tempArray.length; j++) {
        if (hudan.indexOf(newArray, tempArray[j]) < 0) {
          newArray.push(tempArray[j])
        }
      }
    }
    return newArray
  },
  /**
   * [去掉数组中的重复项]
   * @param  {[array]} array [查询数组]
   * @return {[array]}       [返回去重后的数组]
   */
  uniq: function(array) {
    var newArray = []
    for (var i = 0; i < array.length; i++) {
      if (hudan.indexOf(newArray, array[i]) < 0) {
        newArray.push(array[i])
      }
    }
    return newArray
  },
  /**
   * [压缩数组内容，如把第一列的内容合并到一个数组]
   * @param  {...[array]} arrays [description]
   * @return {[array]}           [description]
   */
  zip: function(...arrays) {
    return hudan.unzip(arrays)
  },
  /**
   * [解压缩数组内容，如把第一列的内容与第二列的内容分开，各组成一个数组]
   * @param  {...[array]} arrays [description]
   * @return {[array]}           [description]
   */
  unzip: function(array) {
    var rnum = array.length
    var cnum = array[0].length
    var rowIndx = 0
    var colIndex = 0
    var newArray = []
    var tempArray = []
    while (colIndex < cnum) {
      tempArray = []
      rowIndx = 0
      while (rowIndx < rnum) {
        tempArray.push(array[rowIndx][colIndex])
        rowIndx++
      }
      colIndex++
      newArray.push(tempArray)
    }
    return newArray
  },
  /**
   * [从数组中去除给定的值，要求返回新数组]
   * @param  {[array]} array  [description]
   * @param  {[...*]} values [description]
   * @return {[array]}        [description]
   */
  without(array, ...values) { //函数可以简写成这样
    var newArray = []
    for (var i = 0; i < array.length; i++) {
      if (hudan.indexOf(values, array[i]) < 0) {
        newArray.push(array[i])
      }
    }
    return newArray
  },
  /**
   * [根据路径返回对象里的值]
   * @param  {[Object]} object     [查询数组]
   * @param  {[Array|string]} path [路径]
   * @param  {[*]} defaultValue    [如果没找到且传入该值则返回该值]
   * @return {[*]}                 [返回找到的值]
   */
  get: function get(object, path, defaultValue) {
    var newPath = []
    if (object == null || object == undefined) {
      return defaultValue
    } else if (path.length == 1) {
      return object[path]
    } else {
      newPath = path
      if (typeof path === "string") { //'a[0].b.c' ==>a.0.b.c
        newPath = path.replace(/\[(.)+?\]/g, ".$1").split(".")
      }
      return get(object[newPath[0]], newPath.splice(1), defaultValue) //从1的位置开始删除，返回删除项，即去除了第一项之后的路径
    }
  },
  /**
   * [深度对比]
   * @param  {[type]}  value [description]
   * @param  {[type]}  other [description]
   * @return {Boolean}       [description]
   */
  isEqual: function isEqual(value, other) {
    var type1 = typeof value
    var type2 = typeof other
    var len1 = 0,
      len2 = 0
    if (value != value && other != other) //NaN
      return true
    if (type1 === "object" && type2 === "object") {
      for (let key in value) {
        len1++
      }
      for (key in other) {
        len2++
      }
      if (len1 != len2)
        return false
      for (key in value) {
        if (!key in other) {
          return false
        }
        if (typeof value[key] === "object") {
          if (!isEqual(value[key], other[key]))
            return false
        } else if (value[key] !== other[key]) {
          return false
        }
      }
    } else {
      return value === other
    }
    return true
  },
  /**
   * [根据迭代函数计算结果出现的次数，返回对象]
   * @param  {[type]} col      [description]
   * @param  {[type]} iteratee [description]
   * @return {[type]}          [description]
   */
  countBy: function(col, iteration) {
    var obj = {}
    var res
    for (key in col) {
      if (typeof iteration === "function") {
        res = iteration(col[key])
      } else if (typeof iteration === "string") {
        res = col[key][iteration]
      }
      if (res in obj) {
        obj[res]++
      } else {
        obj[res] = 1
      }
    }
    return obj
  },
  every: function(col, iteratee) {
    var type = toString.call(iteratee)
    switch (type) {
      case "[object Object]":
        for (key in col) {
          if (!hudan.matches(iteratee)(col[key]))
            return false
        }
        return true
      case "[object Array]":
        for (key in col) {
          for (var i = 0; i < iteratee.length; i += 2) {
            var key1 = iteratee[i]
            var value1 = iteratee[i + 1]
            var objs = key1.split(".")
            if (!hudan.matchesProperty(key1, value1)(col[key]))
              return false
          }
        }
        return true
      case "[object String]":
        for (key in col) {
          if (!hudan.property(iteratee)(col[key]))
            return false
        }
        return true
      case "[object Function]":
        for (key in col) {
          if (!iteratee(col[key]))
            return false
        }
        return true
      default:
        return true
    }
  },
  /**
   * [filter 按条件过滤，返回匹配到的项]
   * @param  {array|object} col      [description]
   * @param  {function|object|array|string} iteratee        [description]
   * @return {array}          [description]
   */
  filter: function(col, iteratee) {
    var res = []
    col.forEach(function(item) {
      if (hudan.every([item], iteratee))
        res.push(item)
    })
    return res
  },
  /**
   * [find 从第指定个对象开始找符合条件的第一个对象]
   * @param  {Array|Object} col       [description]
   * @param  {function|object|array|string} iteratee  [description]
   * @param  {[0]}   fromIndex [description]
   * @return {*}      [description]
   */
  find: function(col, iteratee, fromIndex = 0) {
    for (var i = fromIndex; i < col.length; i++) {
      if (hudan.every([col[i]], iteratee))
        return col[i]
    }
    return undefined
  },
  some: function(col, iteratee) {
    var type = toString.call(iteratee)
    switch (type) {
      case "[object Object]":
        for (key in col) {
          if (hudan.matches(iteratee)(col[key]))
            return true
        }
        return false
      case "[object Array]":
        for (key in col) {
          for (var i = 0; i < iteratee.length; i += 2) {
            var key1 = iteratee[i]
            var value1 = iteratee[i + 1]
            var objs = key1.split(".")
            if (hudan.matchesProperty(key1, value1)(col[key]))
              return true
          }
        }
        return false
      case "[object String]":
        for (key in col) {
          if (hudan.property(iteratee)(col[key]))
            return true
        }
        return false
      case "[object Function]":
        for (key in col) {
          if (iteratee(col[key]))
            return true
        }
        return false
      default:
        return false
    }
  },
  forEach: function(col, iteration) {
    for (key in col) {
      if (iteration(col[key], key, col) === false)
        break
    }
    return col
  },
  /**
   * [根据迭代函数返回的值作为key，得到相同的值的数分到一组]
   * @param  {[type]} col       [description]
   * @param  {[type]} iteration [description]
   * @return {[type]}           [description]
   */
  groupBy: function(col, iteration) {
    var obj = {}
    var res
    for (key in col) {
      if (typeof iteration === "function") {
        res = iteration(col[key])
      } else if (typeof iteration === "string") {
        res = col[key][iteration]
      }
      if (res in obj) {
        obj[res].push(col[key])
      } else {
        obj[res] = []
        obj[res].push(col[key])
      }
    }
    return obj
  },
  /**
   * [keyBy 根据迭代函数得到集合对象中，对象的新key值，值即为该项对象]
   * @param  {[array|object]} col       [description]
   * @param  {[type]} iteration [description]
   * @return {object}           [description]
   */
  keyBy: function(col, iteration) {
    var key = ""
    var obj = {}
    if (Array.isArray(col)) {
      col.forEach(function(item) {
        if (typeof iteration == "function") {
          key = iteration(item)
        } else {
          key = hudan.property(iteration)(item)
        }
        obj[key] = item
      })
    } else if (typeof col === "object") {
      Object.keys(col).map(function(value) {
        obj[iteration(value)] = col[value]
      })
    }
    return obj
  },
  /**
   * [partition 根据迭代条件把对象分成两组，一组是返回true的，一组返回false]
   * @param  {[type]} col       [description]
   * @param  {[type]} iteration [description]
   * @return {[type]}           [description]
   */
  partition: function(col, iteration) {
    var trueAry = []
    var falseAry = []
    if (!Array.isArray(col)) {
      col = [col]
    }
    for (var i = 0; i < col.length; i++) {
      if (hudan.every([col[i]], iteration)) {
        trueAry.push(col[i])
      } else {
        falseAry.push(col[i])
      }
    }
    return [trueAry, falseAry]
  },

  /**
   * [reduce 以前一个结果为初始值继续调迭代函数]
   * @param  {object|array} col         [集合]
   * @param  {function} iteratee    [迭代函数]
   * @param  {[*]} accumulator [初始值]
   * @return {*}             [description]
   */
  //测试用例
  //hudan.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
  //  (result[value] || (result[value] = [])).push(key); 以value为key的对象还没在result中则初始化为[]
  //   return result;
  // }, {}); 
  //  ==>{ '1': ['a', 'c'], '2': ['b'] }
  reduce: function(col, iteratee, accumulator) {
    let index = 0
    for (key in col) {
      if (accumulator === undefined && index == 0) {
        accumulator = col[key]
        index = 1
      } else {
        accumulator = iteratee(accumulator, col[key], key, col)
      }
    }
    return accumulator
  },
  /**
   * [reduceRight 同reduce，从右边开始迭代]
   * @param  {[type]} col         [description]
   * @param  {[type]} iteratee    [description]
   * @param  {[type]} accumulator [description]
   * @return {[type]}             [description]
   */
  reduceRight: function(col, iteratee, accumulator) {
    let keys = Object.keys(col)
    let index = keys.length - 1
    if (accumulator === undefined) {
      accumulator = col[keys[index]]
      index = index - 1
    }
    for (let i = index; i >= 0; i--) {
      accumulator = iteratee(accumulator, col[keys[i]], keys[i], col)
    }
    return accumulator
  },

  /**
   * [reject 跟filter相反，返回不符合迭代条件的对象]
   * @param  {[type]} col      [description]
   * @param  {[type]} iteratee [description]
   * @return {[type]}          [description]
   */
  reject: function(col, iteratee) {
    var res = []
    col.forEach(function(item) {
      if (!hudan.every([item], iteratee))
        res.push(item)
    })
    return res
  },

  /**
   * [匹配对象,固定匹配对象参数]
   * @param  {object} source     [匹配对象]
   * @return {[function]}        [匹配函数]
   */
  matches: function(source) {
    return this.bind(this.isMatch, null, "_", source)
  },

  /**
   * [isMatch 在obj里匹配source]
   * @param  {object}  obj    [description]
   * @param  {object}  source [description]
   * @return {Boolean}        [description]
   */
  isMatch: function(obj, source) {
    for (key in source) {
      if (!hudan.isEqual(obj[key], source[key]))
        return false
    }
    return true
  },

  /**
   * [匹配属性]
   * @param  {[array/string]} path   [属性名称"a","a.b","["a","b"]]
   * @param  {[*]} srcValue          [匹配的属性的值]
   * @return {[function]}            [匹配函数]
   */
  matchesProperty: function(path, srcValue) {
    return function(obj) {
      var type = typeof path
      if (type === "string") {
        path = path.split(".")
      }
      var res = obj
      for (val of path) {
        res = res[val]
        if (res == undefined)
          return false
      }
      if (res == srcValue) {
        return true
      }
      return false
    }
  },
  /**
   * [匹配属性是否为true]
   * var objects = [
      { 'a': { 'b': 2 } },
      { 'a': { 'b': 1 } }
    ];
   * @param  {[array/string]} path   [属性名称"a","a.b","["a","b"]]
   * @return {[function]}            [匹配函数]
   */
  property: function(path) {
    return function(obj) {
      var type = typeof path
      if (type === "string") {
        path = path.split(".")
      }
      var res = obj
      for (val of path) {
        res = res[val]
        if (!res)
          return false
      }
      return res
    }
  },

  /**
   * [与property相反，传入匹配对象，返回参数为路径的函数]
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   */
  //   var array = [0, 1, 2],
  //     object = { 'a': array, 'b': array, 'c': array };

  // _.map(['a[2]', 'c[0]'], _.propertyOf(object));
  // // => [2, 0]

  // _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
  // // => [2, 0]
  propertyOf: function(obj) {
    return function(path) {
      if (typeof path == "string") {
        return eval("obj." + path)
      } else {
        nPath = path.map(a => "[\"" + a + "\"]").join("")
        return eval("obj" + nPath)
      }
    }
  },
  once: function(fun) {
    var isInvoked = false
    var res
    return function(...args) {
      if (!isInvoked) {
        isInvoked = true
        res = fun(...args)
      }
      return res
    }
  },
  /**
   * [返回一个返回参数的函数]
   * @param  {[*]} value [description]
   * @return {[type]}       [description]
   */
  constant: function(value) {
    return function() {
      return value
    }
  },
  /**
   * [迭代函数执行n次，迭代函数只有一个参数index]
   * @param  {[type]} n     [description]
   * @param  {[type]} itera [description]
   * @return {[type]}       [description]
   */
  times: function(n, itera) {
    return new Array(n).fill(0).map((val, key) => itera(key))
  },
  bind: function(f, thisArg, ...fixArgs) { //_,1,_,3,_
    return function(...restArgs) { //0,2,4,5   => 0,1,2,3,4,5
      var args = [] //以保证可以多次调用，所以不能改变fixArgs数组，要新创造一个对象
      for ([key, val] of fixArgs.entries()) {
        if (val === "_") {
          args[key] = restArgs.shift()
        } else {
          args[key] = val
        }
      }
      args = args.concat(restArgs)
      return f.call(thisArg, ...args)
    }
  },
  map: function(col, iteratee) {
    var newArray = []
    var type = typeof iteratee
    if (type === "string") {
      for (key in col) {
        newArray.push(hudan.property(iteratee)(col[key]))
      }
    } else {
      var colType = toString.call(col)
      if (colType == "[object Object]") {
        for (key in col) {
          newArray.push(iteratee(col[key], key, col))
        }
      } else {
        for (var i = 0; i < col.length; i++) {
          newArray.push(iteratee(col[i], i, col))
        }
      }
    }
    return newArray
  },
  spread: function(fn) {
    return function(args) {
      return fn.apply(null, args)
    }
  },
  /**
   * [只有对象自身的属性调用iteratee迭代函数]
   * @param  {object} object   [description]
   * @param  {function} iteratee [description]
   * @return {object}          [description]
   */
  forOwn: function(object, iteratee) {
    for (key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        iteratee(object[key], key, object)
      }
    }
    return object
  },
  /**
   * [只有对象自身的属性调用iteratee迭代函数,反序调用]
   * @param  {object} object   [description]
   * @param  {function} iteratee [description]
   * @return {object}          [description]
   */
  forOwnRight: function(object, iteratee) {
    let keys = Object.keys(object)
    for (let i = keys.length - 1; i >= 0; i--) {
      iteratee(object[keys[i]], keys[i], object)
    }
    return object
  },
  values: function(object) {
    var res = []
    if (typeof object === "string") {
      res = object.split("")
    } else {
      for (key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          res.push(object[key])
        }
      }
    }
    return res
  },
  /**
   * [sample 从集合里随机获取一项对象]
   * @param  {[type]} col [description]
   * @return {*}     [description]
   */
  sample: function(col) {
    let index = -1
    if (Array.isArray(col)) {
      index = Math.floor(Math.random() * col.length)
    }
    return col[index]
  },
  /**
   * [sampleSize 从集合里随机获取n个对象，且对象的key值不能重复]
   * @param  {[type]} col [description]
   * @param  {[type]} n   [description]
   * @return {[type]}     [description]
   */
  sampleSize: function(col, n = 1) {
    let index = -1
    let map = new Map()
    if (Array.isArray(col)) {
      if (n > col.length) n = col.length
      while (map.size < n) {
        index = Math.floor(Math.random() * col.length)
        map.set(index, col[index])
      }
    }
    return Array.from(map.values())
  },
  /**
   * [shuffle 利用洗牌算法Fisher-Yates shuffle返回随机排列的数组]
   * @param  {[type]} col [description]
   * @return {[type]}     [description]
   */
  shuffle: function(col) {
    var index = -1
    for (var i = col.length - 1; i >= 0; i--) {
      index = Math.floor(Math.random() * (i + 1)); //每个数的几率都一样
      [col[i], col[index]] = [col[index], col[i]]
    }
    return col
  },

  size: function(col) {
    if (typeof col === "object") {
      return Object.keys(col).length
    } else {
      return String(col).length
    }
  },
  /**
   * [sortBy 实现多级稳定升序排序]
   * @param  {array|object} col       [description]
   * @param  {array[function]|array[property]} iteratees [description]
   * @return {[array]}           [description]
   */
  sortBy: function(col, iteratees) {
    var changed = false
    var funIndex = 0
    var itera
    for (var i = 1; i < col.length; i++) { //插入排序实现
      temp = col[i]
      j = i - 1
      changed = false
      funIndex = 0
      itera = iteratees[funIndex] || iteratees
      if (typeof itera === "string") {
        itera = hudan.property(itera)
      }
      while (j >= 0 && itera(col[j]) >= itera(temp)) {
        if (itera(col[j]) > itera(temp)) { //若能直接比出大小，则直接往后挪
          changed = true
          col[j + 1] = col[j]
        } else if (itera(col[j]) == itera(temp)) { //否则考虑对比下一个属性
          if (funIndex < iteratees.length - 1) {
            j++
            funIndex++
            itera = iteratees[funIndex]
            if (typeof itera === "string") {
              itera = hudan.property(itera)
            }
          } else break
        }
        j--
      }
      if (changed) col[j + 1] = temp
    }
    return col
  },
  isArguments: function(value) {
    return Object.prototype.toString.call(value) === "[object Arguments]"
  },
  isArray: function(value) {
    return Object.prototype.toString.call(value) === "[object Array]"
  },
  /**
   * 生成一个唯一编号，如果给了前缀，id追加到前缀后
   * @param  {[type]} prefix [description]
   * @return {[type]}        [description]
   */
  uniqueId: function(prefix) {
    var id = Date.now().toString() + Math.random().toString().substr(2)
    return prefix != undefined ? prefix + id : id
  },
  /**
   * 把数组或值连接到已给的数组，生成一个新数组
   * @param  {[type]}    array [description]
   * @param  {[number/array]} args  [description]
   * @return {[type]}          [description]
   */
  concat: function(array, ...args) {
    var newArray = array.slice()
    return args.reduce(function(ary, item) {
      if (typeof item === "object")
        return [...ary, ...item]
      else
        return ary.push(item), ary
    }, newArray)
  },
  isBoolean: function(val) {
    return Object.prototype.toString.call(val) === "[object Boolean]"
  },
  isDate: function(val) {
    return Object.prototype.toString.call(val) === "[object Date]"
  },
  isElement: function(obj) {
    return Object.prototype.toString.call(obj) === "[object HTMLBodyElement]"
  },
  /**
   * 可迭代的对象且长度不为0，即有内容的返回false，否则为true
   * @param  {[type]}  obj [description]
   * @return {Boolean}     [description]
   */
  isEmpty: function(obj) {
    try {
      for (val in obj) {
        return false
      }
    } catch (e) {
      return true
    }
    return true
  },
  isError: function(obj) {
    return Object.prototype.toString.call(obj) === "[object Error]"
  },
  isRegExp: function(obj) {
    return Object.prototype.toString.call(obj) == "[object RegExp]"
  },
  isObject: function(obj) { //注：typeof null =="object"
    return (!this.isNull(obj) && typeof obj === "object") || typeof obj === "function"
  },
  isNumber: function(obj) {
    return Object.prototype.toString.call(obj) === "[object Number]"
  },
  isString: function(obj) {
    return Object.prototype.toString.call(obj) === "[object String]"
  },
  isNaN: function(obj) {
    return Number.isNaN(obj) || (typeof obj == "object" && Number.isNaN(obj.valueOf()))
  },
  isUndefined: function(obj) {
    return obj === undefined //要用三等，因为null==undefined
  },
  isNull: function(obj) {
    return obj === null //要用三等，因为null==undefined
  },
  /**
   * is null or undefined
   * @return {Boolean} [description]
   */
  isNil: function(obj) {
    return obj === null || obj === undefined
  },
  /**
   * 是否是一个限定的数字
   * @param  {[type]}  obj [description]
   * @return {Boolean}     [description]
   */
  isFinite: function(obj) {
    if (typeof obj !== "number" || Math.abs(obj) === Infinity) {
      return false
    }
    return true
  },
  toArray: function(obj) {
    var res = []
    if (this.isEmpty(obj)) return res
    for (val in obj) {
      res.push(obj[val])
    }
    return res
  },
  max: function(ary) {
    return ary.length > 0 ? Math.max(...ary) : undefined
  },
  min: function(ary) {
    return ary.length > 0 ? Math.min(...ary) : undefined
  },
  // _.ceil(4.006);
  // // => 5
  // _.ceil(6.004, 2);
  // // => 6.01
  // _.ceil(6040, -2);
  // // => 6100
  /*
  向上取整
   */
  ceil: function(num, precision) {
    var res = num
    var lit = num % 1
    if (this.isUndefined(precision)) {
      if (lit > 0)
        res = (num - num % 1) + 1
    } else {
      if (lit > 0) {
        lit = lit * 10 ** (-precision)
        res = (num - lit) + 10 ** (-precision)
      }

    }
    return res
  },
  // _.round(4.006);
  // // => 4
  // _.round(4.006, 2);
  // // => 4.01
  // _.round(4060, -2);
  // // => 4100
  /*
  向下取整
   */
  // round:function(){

  // },
  /**
   * 把原对象自身的属性赋给目标对象，若有相同的则覆盖
   * @param  {[type]}    dest   [description]
   * @param  {...[type]} source [description]
   * @return {[type]}           [description]
   */
  assign: function(dest, ...source) {
    source.reduce(function(res, obj) {
      Object.keys(obj).reduce(function(r, key) {
        r[key] = obj[key]
        return r
      }, res)
      return res
    }, dest)
    return dest
  },
  /**
   * 把原对象包括原型上的属性赋给目标对象，若有相同的则覆盖
   * @param  {[type]}    dest   [description]
   * @param  {...[type]} source [description]
   * @return {[type]}           [description]
   */
  assignIn: function(dest, ...source) {
    source.reduce(function(res, obj) {
      for (key in obj) {
        res[key] = obj[key]
      }
      return res
    }, dest)
    return dest
  },
  keys: function(obj) {
    return Object.keys(obj)
  },
  parseJson: function() {
    var index = -1
    var ch = ""
    var isEnd = false
    var str

    function doIt(jsonStr) {
      str = jsonStr
      ch = ""
      index = -1
      isEnd = false
      next()
      var resule
      try {
        result = value()
        assert(index < str.length)
        return result
      } finally {
        doIt.index = index
      }
    }
    return doIt

    function assert(test) {
      if (test)
        throw new SynctaxError(ch, index)
    }

    function next(char) {
      if (char !== ch && char != undefined) {
        throw new Error("not match 'true' or 'false' or 'null'")
      }
      if (index < str.length) {
        index++
        ch = str[index]
      } else {
        isEnd = true
      }
    }

    function number() {
      var num = ""
      while (isNumberChar(ch)) {
        num += ch
        next()
        if (isEnd) break
      }
      delSpace()
      return parseFloat(num)
    }

    function isNumberChar(c) {
      var chars = ["-", "+", "e", "E", "."]
      if (chars.indexOf(c) > -1)
        return true
      if (ch >= "1" && ch <= 9) {
        return true
      }
      return false
    }

    function string() {
      var str = ""
      next()
      while (ch != "\"") {
        str += ch
        next()
        if (isEnd) break
      }
      next()
      delSpace()
      return str
    }

    function array() {
      var ary = []
      var val = null
      next()
      while (ch != "]") {
        val = value()
        ary.push(val)
        val = null
        if (ch == ",") {
          next()
          if (isEnd) break
        }
      }
      next()
      delSpace()
      return ary
    }

    function object() {
      var obj = {}
      var key = ""
      var val = null
      next()
      while (ch != "}") {
        key = value()
        if (ch === ":") {
          next()
          val = value()
          obj[key] = val
          if (ch === ",") {
            next() //到下一个引号
          }
        }
        if (isEnd) break
      }
      next()
      delSpace()
      return obj
    }

    function value() {
      delSpace()
      if (ch === "\"") {
        return string()
      } else if (isNumberChar(ch)) {
        return number()
      } else if (ch == "t") {
        next("t")
        next("r")
        next("u")
        next("e")
        return true
      } else if (ch === "f") {
        next("f")
        next("a")
        next("l")
        next("s")
        next("e")
        return false
      } else if (ch === "n") {
        next("n")
        next("u")
        next("l")
        next("l")
        return null
      } else if (ch === "{") {
        return object()
      } else if (ch === "[") {
        return array()
      } else throw new SynctaxError(ch, index)
    }

    function delSpace() {
      while (ch && ch.indexOf(" ") > -1) {
        next()
      }
    }
  }(),
  delay: function(fn, wait, ...args) {
    return setTimeout(function() {
      fn(...args)
    }, wait)
  },
  /**
   * [每隔duration时间执行fn，重复times次]
   * @param  {Function} fn       [description]
   * @param  {[type]}   times    [description]
   * @param  {[type]}   duration [description]
   * @return {[type]}            [description]
   */
  repeat1: function(fn, times, duration) {
    return function() {
      if (times <= 0) return
      var count = 0
      var id = setInterval(function() {
        count++
        fn()
        if (count == times) {
          clearInterval(id)
        }
      }, duration)
    }
  },
  repeat2: function(fn, times, duration) {
    return function() {
      var id = setInterval(fn, duration)
      setTimeout(function() {
        clearTimeout(id)
      }, duration * times)
    }
  },
  repeat3: function(fn, times, duration) {
    return function() {
      for (var i = 0; i < times; i++) {
        setTimeout(fn, duration * i)
      }
    }
  },
  /**
   * [throttle 每次事件执行的间隔时间至少为wait，否则取消事件]
   * @param  {Function} fn   [description]
   * @param  {Number}   wait [description]
   * @return {[type]}        [description]
   */
  throttle: function(fn, wait = 0) {
    var lastTime = -Infinity
    return function(...args) {
      var now = Date.now
      if (now - lastTime > wait) {
        fn(...args)
        lastTime = now
      }
    }
  },
  /**
   * [debounce 执行事件时，若没到wait时间又执行了，则上次取消，开始新的一次计算时间再执行]
   * @param  {Function} fn   [description]
   * @param  {Number}   wait [description]
   * @return {[type]}        [description]
   */
  debounce: function(fn, wait = 0) {
    var timeId
    return function(...args) {
      cancelTimeOut(timeId)
      timeId = setTimeout(function() {
        fn(...args)
      }, wait)
    }
  },
  /**
   * [把字符串转为驼峰式]
   * @param  {[type]} str [description]
   * @return {[type]}     [description]
   * 注不能用\w,\b,因为下划线也属于\w,'__FOO_BAR__'
   */
  camelCase: function(str) {
    var res = str.toLowerCase().replace(/[^0-9a-zA-Z]*([a-zA-Z])([a-zA-Z]+)[^0-9a-zA-Z]*/g,
      function(match, h1, h2) {
        h1 = h1.toUpperCase()
        return h1 + h2
      })
    return res[0].toLowerCase() + res.substr(1)
  },
  /**
   * [首字母转换为大写，其他转换为小写]
   * @param  {string} str [description]
   * @return {boolean}     [description]
   */
  capitalize: function(str) {
    return str.replace(/^(\w)(.*)/, (match, x, y) => x.toUpperCase() + y.toLowerCase())
  },
  /**
   * [判断字符串是否以某个字符串结尾]
   * @param  {string} str    [description]
   * @param  {string} target [description]
   * @param  {[number]} pos    [description]
   * @return {boolean}        [description]
   */
  endsWith: function(str, target, pos = str.length) {
    return (new RegExp(String.raw `${target}$`)).test(str.substr(0, pos))
  },
  /**
   * [转义字符串中的"&", "<", ">", '"', and "'"]
   * @param  {String} str [description]
   * @return {[type]}     [description]
   */
  escape: function(str = "") {
    var obj = {
      "&": '&amp;',
      "<": '&lt;',
      ">": '&gt;',
      "\"": '&quot;',
      "'": '&#39;'
    }
    return str.replace(/[&<>"']/g, match => obj[match])
  },
  /**
   * [把字符串转换为小写，按空格分隔单词]
   * @param  {String} str [description]
   * @return {[type]}     [description]
   */
  lowerCase: function(str = "") {
    if (str == "") return str
    var ary = str.split(/[^a-zA-Z]/)
    var res = ary.length > 1 ? ary.join(" ") : ary[0].replace(/[A-Z]/g, a => " " + a)
    return res.toLowerCase().trim()
  },
  /**
   * [第一个单词小写]
   * @param  {String} str [description]
   * @return {[type]}     [description]
   */
  lowerFirst: function(str = "") {
    return str.replace(/^[A-Z]/, a => a.toLowerCase())
  },
  pad: function(str = "", length = 0, chars = " ") {
    if (str.length == length) return str
    var lenLeft = parseInt((length - str.length) / 2)
    var lenRight = length - str.length - lenLeft

    function f(len) {
      var res = ""
      if (len > chars.length) {
        var num = parseInt(len / chars.length)
        res = chars.repeat(num) + chars.substr(0, len - num * chars.length)
        return res
      }
      res = chars.substr(0, chars.length)
      return res
    }
    return str.replace(/^/, i => f(lenLeft)).replace(/$/, i => f(lenRight))
  },
  memoize: function memoize(f, resolver = it => it) {
    var cache = new hudan.memoize.Cache
      //Map类型可以自定义，在此还是给hudan.memoize的Cache属性定义为Map类型
    function memod() {
      var key = resolver(...args)
      if (cache.has(key)) {
        return cache.get(key)
      }
      var res = f(...args)
      cache.set(key, res)
      return res
    }
    memod.cache = cache
    return memod
  },
}
hudan.memoize.Cache = Map