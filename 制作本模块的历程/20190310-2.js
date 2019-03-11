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

从准备饭局说起
真的只是打电话给饭店预定位置吗?好像还真是,可能北京会堵车吧
Work.prototype.ready=function(){

}
这个方法里面传进去一个数组,对象包含我们工作要准备的所有道具,道具自带检查自己是否准备好的方法,
这样的话,我们还得创建一个类,称之为道具,词穷啊,想不到更好的词儿了,
function Prop(name,widgetFeature){
  this.name=name
  this.widgetFeature=widgetFeature || {}  //设计成一个对象吧
  this.check=function(){} //检查控件或者activity的方法不一样,检查方法写到构造函数里面
  this.isReady=false
}

//检查控件或者activity的方法不一样
Prop.prototype.setCheck=function(check){
  //根据他自己的内容来设计它自己的检查方式
  //难道我们还要设计一个检查类吗?
  //还是不设计了吧
  this.check=check
}

那么ready就遍历道具数组
//这里的话, 准备的检查方法和isSUccessful的检查方法可以是一样的
//当然了  我们也可以更新他们的检查方法

Work.prototype.ready=function(){
  var props=this.readyProps
  return hasProps(props)
}
Work.prototype.isSuccessful=function(){
  var props=this.successProps
  return hasProps(props)
}
function hasProps(props){
  var props=props || []
  for(var i=0;i<props.length;i++){
    var prop=props[i]
    if(!prop.check()){
      return false
    }
  }
  return true
}
Work.prototype.setReady=function(ready){
  this.ready=ready
}
Work.prototype.setIsSuccessful=function(isSuccessful){
  this.isSuccessful=isSuccessful
}


// work是不是应该有自己的props属性,吃饭前的道具,吃饭后的道具
function Work(name,readyProps,successProps){
  this.name=name
  this.readyProps=readyProps || []
  this.successProps=successProps || []
}
Work.prototype.setProps=function(props){
  this.props=props
}


//autojs的特色就是控件,我们的检查方法也默认找控件吧
function Prop(name,widgetFeature){
  this.name=name
  this.widgetFeature=widgetFeature || {}  //设计成一个对象吧
  this.check=exist //检查控件或者activity的方法不一样,检查方法写到构造函数里面,我们默认是检查控件是否存在
  this.isReady=false
}

Prop.prototype.setWidgetFeature=function(widgetFeature){
  this.widgetFeature=widgetFeature
}
function exist(widgetFeature, searchCount, intervalTime) {
  var searchCount = searchCount || 3
  var intervalTime = intervalTime || 1000
  //widgetFeature是一个json格式
  //desc,text,id,boundsInside,bounds,boundsContains
  if (!(getObjType(widgetFeature) == "Object")) {
    log('正确的对象例子')
    var obj = {
      k1: "v1",
      k2: "v2",
      k3: "v3"
    }
    log(JSON.stringify(obj))
    throw '请传入一个对象'
  }
  var widgetFeature = widgetFeature || {}
  var mySelector = ""
  for (var k in widgetFeature) {
    if (k == "boundsInside" || k == "bounds" || k == "boundsContains") {
      mySelector += k + "(" + widgetFeature[k][0] + "," + widgetFeature[k][1] + "," + widgetFeature[k][2] + "," + widgetFeature[k][3] + ")."
      continue;
    }
    mySelector += k + "(\"" + widgetFeature[k] + "\")."
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

function getObjType(obj) {
  // JavaScript 标准文档中定义: [[Class]] 的值只可能是下面字符串中的一个： Arguments, Array, Boolean, Date, Error, Function, JSON, Math, Number, Object, RegExp, String.
  var result = Object.prototype.toString.call(obj)
  result = result.match(/ \w+/)[0]
  result = result.replace(/ /g, '')
  return result
}



