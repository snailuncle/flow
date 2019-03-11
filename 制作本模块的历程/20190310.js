// 还是用饭局举例子吧
// 一个脚本是由一个一个的动作完成的
// 这个动作要发生,需要特定的环境,
// 并且这个动作还要执行成功,不然也没卵用

// 目前代码是这样设计的
// flow.js暂时还没有写出来,
// 我们先看看它应该具备哪些属性和方法,
// 然后我们再去写flow.js

//一个流程由若干个工作衔接起来
var Flow=require('./flow.js')
var myFlow=new Flow('firstFlow')
myFlow.add(work1)
myFlow.add(work2)
myFlow.add(work3)
myFlow.go()
//感觉用add有点繁琐,
//用数组好一点吗?
var Flow=require('./flow.js')
var myFlow=new Flow('firstFlow')
myFlow.addFlow(work1,work2,work3)
myFlow.go()
//感觉数组还可以

// 那么work又应该有什么属性呢?
// work是流程中的某个工作,
// 我们应该将他设计成独立的呢,还是上下文相关呢?
// 用不用设计 work.setContext()
//想了想还是设计成独立的吧

// 那么work又应该有什么属性呢?
我们把饭局当做一个工作的话,
想一想饭局的时候,我们要干嘛?

第一,首先得有饭店,服务员,酒,菜,甲方,乙方,这些是我们前期准备的东西
所以需要有一个
work.ready()

第二,万事俱备,开动饭局,
work.go()

第三,毕竟饭局这个工作,是用来谈业务的,所以我们还得有一个
work.isSuccessful()


大致以上三个方法,我们的饭局就完成了,可是如果饭局上业务没有谈好,怎么办,?不行,还得加个失败处理,比如,饭店关门, 停电了,服务员出岔子了,菜不好吃,甲乙方谈不拢,其他的都好,谈不拢就算这个饭局白弄了,
work.fail()


以上就是一个饭局工作的基本流程
work.ready()
work.go()
work.isSuccessful()
work.fail()

下面我们来写work这个构造函数
function Work(name){
  this.name=name
}
Work.prototype.ready=function(){

}
Work.prototype.go=function(){

}
Work.prototype.isSuccessful=function(){

}
Work.prototype.fail=function(){

}
