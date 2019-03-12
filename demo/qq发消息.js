//  //导入flow模块
//  function requireFlow() {
//   var url = 'https://raw.githubusercontent.com/snailuncle/flow/master/flow/flow.js'
//   var r = http.get(url)
//   log("code = " + r.statusCode);
//   var html = r.body.bytes()
//   files.write('./flow.js', '')
//   files.writeBytes('./flow.js', html)
//   var flow = require('./flow.js')
//   return flow
// }
var common = require('./common.js')
var flow = require('./flow.js')
// var flow = requireFlow()
var Flow = flow.flow
var Work = flow.work
var Prop = flow.prop
var Failure = flow.failure
var qq群发消息工作流 = new Flow('qq群发消息')
var 打开QQ = new Work('打开QQ')
var 点击某个群 = new Work('点击某个群')
var 发消息 = new Work('发消息')
//第一: 先设置动作发生前后,也就是go之前之后控件的信息 (由于控件信息都差不多,我们就把readyProps和successProps设置到一块)
var 消息 = new Prop('消息', {
  text: '消息'
})
var 联系人 = new Prop('联系人', {
  text: '联系人'
})
var 发送 = new Prop('发送', {
  text: '发送'
})
var 要发送的消息 = '早安各位,太阳真好,出去逛街吧'
var 自定义消息 = new Prop('自定义消息', {
  text: 要发送的消息
})
打开QQ.setSuccessProps([
  消息, 联系人
])
点击某个群.setSuccessProps([
  发送
])
发消息.setSuccessProps([
  自定义消息
])
//第二: 设置我们在每个场景的行为,也就是go
function 打开QQGo() {
  common.启动app('QQ')
}

function 点击某个群Go() {
  var x = 625
  var y = 450
  press(x, y, 1)
}

function 发消息Go() {
  var 输入框fullId = "com.tencent.mobileqq:id/input"
  var 输入框 = id(输入框fullId).findOnce()
  if (输入框) {
    输入框.setText(要发送的消息)
    var 发送按钮 = text('发送').findOnce()
    if (发送按钮) {
      发送按钮.click()
    }
  }
}
打开QQ.setAction(打开QQGo)
点击某个群.setAction(点击某个群Go)
发消息.setAction(发消息Go)
//第三:　把设计好的工作添加到工作流中
qq群发消息工作流.add(打开QQ, 点击某个群, 发消息)
//第四: 处理可能发生的异常
//比如发消息失败了怎么办?这里我们设置为按三次次返回键,重新执行工作流,给失败的工作,起一个名字failureName,和一个处理方式failureHandle
var failureName = null
var failureHandle = null
//格式 工作名-方法名-控件名
failureName = '打开QQ-successCheck-消息'
failureHandle = function () {
  var work = this.work
  log('本次執行異常的工作是')
  log(work)
  work.go()
}
failureName = '点击某个群-successCheck-发送'
failureHandle = function () {
  var work = this.work
  log('本次執行異常的工作是')
  log(work)
  work.go()
}
var 点击某个群failure = new Failure(failureName, failureHandle)
点击某个群.addFailure(点击某个群failure)
failureName = '发消息-successCheck-自定义消息'
failureHandle = function () {
  var work = this.work
  log('本次執行異常的工作是')
  log(work)
  work.go()
}
var 发消息failure = new Failure(failureName, failureHandle)
发消息.addFailure(发消息failure)
//第五:　启动工作流()
qq群发消息工作流.go()
