var _ = require("lodash")

function Flow(name, works) {
  this.name = name || 'unknownFlow'
  this.type = 'Flow'
  this.works = works || []
  if (this.works.length > 0) {
    for (var i = 0; i < this.works.length; i++) {
      var work = this.works[i]
      work.flow = this
    }
  }
}

function Work(name, readyProps, go, successProps) {
  this.name = name || "unknownWork"
  this.type = 'Work'
  this.readyProps = readyProps || []
  this.successProps = successProps || []
  this.allFailures = {}
  this.readyCheck = function () {
    var props = this.readyProps
    try {
      return hasProps(props)
    } catch (e) {
      log(e)
      var propName = e
      throw this.name + 'readyCheck' + '-' + propName
    }
  }
  this.go = go || function () {
    toastLog(this.name + ' go')
  }
  this.successCheck = function () {
    var props = this.successProps
    try {
      return hasProps(props)
    } catch (e) {
      log(e)
      var propName = e
      throw this.name + 'successCheck' + '-' + propName
    }
  }
}

function Prop(name, feature, check) {
  this.name = name || "unknownProp"
  this.type = 'Prop'
  this.feature = feature || {}
  this.check = function () {
    try {
      return (check ? check() : exist(this.feature))
    } catch (e) {
      log(e)
      var propName = e
      throw propName
    }
  }
}

function Failure(name, handle) {
  this.name = name || "unknownFailure"
  this.type = 'Failure'
  this.handle = handle || function () {
    throw this.name
  }
}
var flow = {
  flow: Flow,
  work: Work,
  prop: Prop,
  failure: Failure
}
module.exports = flow
//========================================================================================FlowFlowFlowFlowFlowFlow=============================================================================================================
Flow.prototype.add = function () {
  var works = this.works
  var nextWorks = arguments
  for (var i = 0; i < nextWorks.length; i++) {
    var work = nextWorks[i]
    work.flow = this
    if (work.type == "Work") {
      works.push(work)
    } else if (work.type == "Flow") {
      works.push(work.works)
    }
  }
}
//展开works
Flow.prototype.spread = function () {
  var newWorks = []
  var works = this.works
  newWorks = _.flattenDeep(works);
  this.works = newWorks
}

function spreadFlow(flow, newWork) {
  var newWork = newWork || []
  var works = flow.works
  for (var i = 0; i < works.length; i++) {
    var work = works[i]
    if (work.type == "Work") {
      newWork.push(work)
    } else if (work.type == "Flow") {
      spreadFlow(flow, newWork)
    } else {
      throw 'not Work not Flow !!!'
    }
  }
  return newWork
}
Flow.prototype.set = function (works) {
  this.works = works
  for (var i = 0; i < works.length; i++) {
    var work = works[i]
    work.flow = this
  }
}
Flow.prototype.go = function () {
  this.spread()
  var works = this.works
  for (var i = 0; i < works.length; i++) {
    var work = works[i]
    try {
      log("before " + work.name + ".ready()")
      work.ready()
      log("after " + work.name + ".ready()")
      log("before " + work.name + ".go()")
      work.go()
      log("after " + work.name + ".go()")
      log("before " + work.name + ".isSuccessful()")
      work.isSuccessful()
      log("after " + work.name + ".isSuccessful()")
    } catch (e) {
      try {
        work.fail(this.name + '-' + e)
      } catch (e) {
        log(e)
        throw e
      }
    }
    // try {
    //   work.ready()
    //   work.go()
    //   work.isSuccessful()
    // } catch (e) {
    //   log(e)
    //   work.fail(e)
    // }
  }
}
//=======================================================================================WorkWorkWorkWorkWorkWork=================================================================================================================
Work.prototype.ready = function () {
  return this.readyCheck()
}
Work.prototype.isSuccessful = function () {
  return this.successCheck()
}
Work.prototype.addFailure = function (failure) {
  var name = failure.name
  failure.work = this
  this.allFailures[name] = failure
}
Work.prototype.fail = function (e) {
  log('work-->' + this.name + '的方法fail接收一个参数' + e)
  var allFailures = this.allFailures
  log('work-->' + this.name + 'allFailures=')
  log(allFailures)
  for (var failureName in allFailures) {
    if (failureName == e.toString()) {
      log('找到了一样的failureName', failureName)
      var failure = allFailures[failureName]
      failure.handle()
      return;
    }
  }
  throw e
}

function hasProps(props) {
  var props = props || []
  for (var i = 0; i < props.length; i++) {
    var prop = props[i]
    if (!prop.check()) {
      log('下面这个控件没找到')
      log(prop)
      throw prop.name
      return false
    }
  }
  return true
}
Work.prototype.setReadyProps = function (readyProps) {
  this.readyProps = readyProps
}
Work.prototype.setGo = function (action) {
  this.go = action
}
Work.prototype.setSuccessProps = function (successProps) {
  this.successProps = successProps
}
Work.prototype.setReadyCheck = function (readyCheck) {
  this.readyCheck = readyCheck
}
Work.prototype.setSuccessCheck = function (successCheck) {
  this.successCheck = successCheck
}
//=========================================================================================PropsPropsPropsPropsPropsProps===============================================================================================================
Prop.prototype.setFeature = function (feature) {
  this.feature = feature
}
Prop.prototype.setCheck = function (check) {
  this.check = function () {
    try {
      return (check ? check() : exist(this.feature))
    } catch (e) {
      log(e)
      var propName = e
      throw propName
    }
  }
}
//============================================================================FailureFailureFailureFailureFailureFailure===============================================================================================================
Failure.prototype.setName = function (name) {
  this.name = name
}
Failure.prototype.setHandle = function (handle) {
  this.handle = handle
}
//==========================================================================================公用函数=================================================================================================================
function getObjType(obj) {
  // JavaScript 标准文档中定义: [[Class]] 的值只可能是下面字符串中的一个： Arguments, Array, Boolean, Date, Error, Function, JSON, Math, Number, Object, RegExp, String.
  var result = Object.prototype.toString.call(obj)
  result = result.match(/ \w+/)[0]
  result = result.replace(/ /g, '')
  return result
}

function exist(propFeature, searchCount, intervalTime) {
  var searchCount = searchCount || 10
  var intervalTime = intervalTime || 1000
  //propFeature是一个json格式
  //desc,text,id,boundsInside,bounds,boundsContains
  if (!(getObjType(propFeature) == "Object")) {
    log('你传入的propFeature是')
    log(propFeature)
    log('propFeature--控件特征描述是一个对象,正确的对象例子')
    var obj = {
      k1: "v1",
      k2: "v2",
      k3: "v3"
    }
    log(JSON.stringify(obj))
    throw '请传入一个对象'
  }
  var propFeature = propFeature || {}
  var mySelector = ""
  for (var k in propFeature) {
    if (k == "boundsInside" || k == "bounds" || k == "boundsContains") {
      mySelector += k + "(" + propFeature[k][0] + "," + propFeature[k][1] + "," + propFeature[k][2] + "," + propFeature[k][3] + ")."
      continue;
    }
    mySelector += k + "(\"" + propFeature[k] + "\")."
  }
  mySelector += 'findOnce()'
  for (var i = 0; i < searchCount; i++) {
    // log('查找第%d次',i)
    var searchResult = eval(mySelector)
    if (searchResult) {
      return searchResult
    }
    sleep(intervalTime)
  }
  return false
}
