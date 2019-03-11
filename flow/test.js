var flow=require('./flow.js')
log(flow)
var Flow=flow.flow
var Work=flow.work
var Prop=flow.prop
var myFlow=new Flow('abc')
log(myFlow.type+myFlow)
var myWork=new Work('abc')
log(myWork.type+myWork)
var myProp=new Prop('abc')
log(myProp.type+myProp)
