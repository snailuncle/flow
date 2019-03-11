//先看看我们最后是怎样使用flow的

// 假设我们的业务流程是work1-work6

var flow=require('./flow.js')
var Flow=flow.flow
var Work=flow.work
var Prop=flow.prop
var Failure=flow.failure

var myFlow=new Flow('myFlow')
var work1=new Work('work1')
var work2=new Work('work2')
myFlow.add(work1)
myFlow.add(work2)

var mySecondFlow=new Flow('mySecondFlow')
var work3=new Work('work3')
var work4=new Work('work4')
mySecondFlow.add(work3)
mySecondFlow.add(work4)

myFlow.add(mySecondFlow)


var work5=new Work('work5')
var work6=new Work('work6')

myFlow.add(work5,work6)


var myThirdFlow=new Flow('myThirdFlow')
myThirdFlow.add(work1,work2,mySecondFlow,work5,work6)

myFlow.add(myThirdFlow)
myFlow.go()

//这样逻辑听清楚的,最好下面不要有代码了,
//那么work的属性和方法我们在哪里添加呢?


