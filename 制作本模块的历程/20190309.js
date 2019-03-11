// 一般脚本流程,都是在各个页面来回切换,再加上点击或者滑动,那么理想的调用方式就是下面这样:
var Flow=require('./flow.js')
var myFlow=new Flow('first flow')
myFlow.add(page1Info)
myFlow.add(page2Info)
myFlow.add(page3Info)
myFlow.start()

//上面我们添加了三个页面,并且让flow开始工作,之后不用我们管了,好爽

//但是运行出错了怎么办,pageInfo又应该包含哪些信息呢?

// 首先我们看一下pageInfo应该包含哪些信息

// 然后我们处理一下异常情况

//=========================第一部分  pageInfo 包含哪些信息======================================================

首先我们需要知道当前是哪个页面,
有三种或者更多的方法,我只说我知道的
第一种: 判断当前activity, 如果每个页面的activity都不一样的话,可以用这个方法
第二种: 获取当前页面的所有文字,如果每个页面的文字都不用一样的话,可以种这个方法
第三种: 查找页面的专属控件, 如果每个页面的控件布局或者数量或者位置不一样的话,我们就用这个方法

所以我们的pageInfo就应该包含下面的东西:
第一个信息:  页面信息,比如说当前是注册页面,或者登录页面,或者文章列表页,或者文章详情页,或者评论区
第二个信息:  页面操作,比如滑动,点击,等待,弹窗等操作.



我突然想到,我们并不是要在特定的页面来做事情,而是在特定的时机做特定的事情,是的,就是这个样子.
那么我们用pageInfo这个名字就不太合适了,换个名字 ==>  scene  ,灵光一闪,马上记录,好像拍电影一样,
演员在每个场景,根据剧本来演一些东西
下面是一些电影名词术语
floor 场地

props 道具

camera 摄影机

closeShot 特写

由于场景的一些方法都是重复的,我们就设定一个场景类

function Scene(name){
  this.name=name
  //道具的话,比如电脑,摄像机,灯光，音响,剧本，演员，化妆服装，场地
  this.startProps={}  //场景开始必备道具
  this.endProps={}  //场景结束必备道具
  //给这个场景起一个名字, 把所有的道具都放上去,我们就可以开始拍戏了
  this.action=function (){}
  //拍戏的时候可能有哪些异常,我们用对象来存储,一开始没有异常
  //异常有个名字,我们用对象来存储每个异常
  this.Exception={}
  this.disposeNotReadyMethod=function(){}
  this.successInspectMethod=function(){}
}

Scene.prototype.setStartProps=function(startProps){
  this.startProps=startProps
}
Scene.prototype.getStartProps=function(){
  return this.startProps
}
// 道具的  名字  特征  检查方法
// 开始的时候灯光准备好了吗  摄影好了吗  startProps
// 结束的时候灯光收拾好了吗  摄影机收好了吗  endProps
Scene.prototype.addProps=function(propType,propName,propFeature,propInspectMethod){
  this[propType][propName][name]=propName
  this[propType][propName][propFeature]=propFeature
  this[propType][propName][propInspectMethod]=propInspectMethod
}
//但是演戏一次性通过的概率很低,基本上都得好几次,就跟我们做脚本一样,
// 脚本中出现了异常,我们也得处理,给异常一个名字,给异常一个处理方式
Scene.prototype.addException=function(exceptionName,handleExceptionMethod){
  this.Exception[exceptionName]=handleExceptionMethod
}
//拍电影预备动作
Scene.prototype.ready=function(){
  //各部门注意,要开拍了,把你们自己的工作都准备好,
  var props=this.props
  var notReadyProps=[]
  for(var k in props){
    var prop=props[k]
    var propName=prop.name
    var propFeature=prop.propFeature
    var propInspectMethod=prop.propInspectMethod
    log('当前道具名字是'+propName)
    log('当前道具特征是'+propFeature)
    log('当前道具检查方法是'+propInspectMethod)
    //检查方法返回一个布尔值,告诉导演到底准备好了吗
    var isReady=propInspectMethod()
    if(!isReady){
      notReadyProps.push(propName)
    }
  }
  //最后我们统计没有准备好的道具
  var count=notReadyProps.length
  if(count==0){
    log('所有道具都准备好了')
    return true
  }else{
    log('这些道具还没准备好呢'+notReadyProps.toString())
    return false
  }
}

Scene.prototype.areYouReady=function (){
  return this.ready()
} //各部门,你门准备好了吗?

//如果有道具没有准备好怎么办?具体情况,具体对待吧
Scene.prototype.disposeNotReady=function (){
  this.disposeNotReadyMethod()
}
Scene.prototype.setDisposeNotReadyMethod=function (fn){
  this.disposeNotReadyMethod=fn
}

//拍电影总有收工的时候,就是导演说收工,
//那么脚本的动作执行完毕之后是否执行有效或者说符合预期呢?,也就是是否完成了他的任务

Scene.prototype.isFinish=function(){
  return this.isSuccess()
}
Scene.prototype.setSuccessInspectMethod=function(fn){
  this.successInspectMethod=fn
}


//感觉起名字好难啊

// 这一页就算写完了.
