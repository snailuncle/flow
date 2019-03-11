//先看看我们最后是怎样使用flow的

// 假设我们的业务流程是work1-work6

var Flow=require('./flow.js')
var Work=require('./work.js')
var Prop=require('./prop.js')

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


var work5=new Work('work5')
var work6=new Work('work6')

myFlow.add(work5,work6)
myFlow.addFlow(mySecondFlow)

myFlow.go()

//这样逻辑听清楚的,最好下面不要有代码了,
//那么work的属性和方法我们在哪里添加呢?


