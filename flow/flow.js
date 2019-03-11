var _ = require("lodash")

function Flow(name, works) {
  this.name = name || 'unknownFlow'
  this.type = 'Flow'
  this.works = works || []
}

function Work(name, readyProps, go, successProps) {
  this.name = name || "unknownWork"
  this.type = 'Work'
  this.readyProps = readyProps || []
  this.successProps = successProps || []
  this.allFailures = {}
  this.readyCheck = function () {
    var props = this.readyProps
    return hasProps(props)
  }
  this.go = go || function () {toastLog(this.name)}
  this.successCheck = function () {
    var props = this.successProps
    return hasProps(props)
  }
}

function Prop(name, feature, check) {
  this.name = name || "unknownProp"
  this.type = 'Prop'
  this.feature = feature || {}
  this.check = function () {
    try {
      check || exist
    } catch (e) {
      log(e)
      throw this.name + "-->error"
    }
  }
}

function Failure(prop, handle) {
  this.prop = prop
  this.name = prop.name || "unknownFailure"
  this.type = 'Failure'
  this.handle = handle || function () {
    throw this.name
  }
}
var flow = {
  flow: Flow,
  work: Work,
  prop: Prop,
  failure:Failure
}
module.exports = flow
//========================================================================================FlowFlowFlowFlowFlowFlow=============================================================================================================
Flow.prototype.add = function () {
  var works = this.works
  var nextWorks = arguments
  for (var i = 0; i < nextWorks.length; i++) {
    var work = nextWorks[i]
    // log(work)
    if(work.type=="Work"){
      works.push(work)
    }else if(work.type=="Flow"){
      works.push(work.works)
    }
  }
}
//添加的工作中,可能有flow,work,或者[work1,work2,...]
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
}
Flow.prototype.go = function () {
  this.spread()
  var works = this.works
  for (var i = 0; i < works.length; i++) {
    var work = works[i]
    try {
      work.ready()
      work.go()
      work.isSuccessful()
    } catch (e) {
      log(e)
      work.fail(e)
    }
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
  this.allFailures[name] = failure
}
Work.prototype.fail = function (e) {
  var allFailures = this.allFailures
  for (var failureName in allFailures) {
    if (failureName == e.toString()) {
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
      return false
    }
  }
  return true
}
Work.prototype.setReadyProps = function (readyProps) {
  this.readyProps = readyProps
}
Work.prototype.setGo = function (go) {
  this.go = go
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
      check || exist
    } catch (e) {
      log(e)
      log(this.name + "-->error")
      throw this.name
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

function getRndColor() {
  var a, r, g, b;
  a = Math.floor(0), r = Math.floor(rnd_0_255()), g = Math.floor(rnd_0_255()), b = Math.floor(rnd_0_255());
  // var 反色 = -1 - colors.argb(0, r, g, b);
  var color = colors.argb(0, r, g, b);
  color = colors.toString(color)
  return color
}

function rnd_0_255() {
  var r = parseInt(255 * Math.random())
  return r
}

function exist(propFeature, searchCount, intervalTime) {
  var searchCount = searchCount || 3
  var intervalTime = intervalTime || 1000
  //propFeature是一个json格式
  //desc,text,id,boundsInside,bounds,boundsContains
  if (!(getObjType(propFeature) == "Object")) {
    log('正确的对象例子')
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
