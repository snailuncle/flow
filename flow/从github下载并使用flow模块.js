 //导入flow模块
 function requireFlow() {
   var url = 'https://raw.githubusercontent.com/snailuncle/flow/master/flow/flow.js'
   var r = http.get(url)
   log("code = " + r.statusCode);
   var html = r.body.bytes()
   files.write('./flow.js', '')
   files.writeBytes('./flow.js', html)
   var flow = require('./flow.js')
   return flow
 }
 var flow = requireFlow()
 var Flow = flow.flow
 var Work = flow.work
 var Prop = flow.prop
 var Failure = flow.failure
 var myFlow = new Flow('myFlow')
 var work1 = new Work('work1')
 var work2 = new Work('work2')
 myFlow.add(work1)
 myFlow.add(work2)
 var mySecondFlow = new Flow('mySecondFlow')
 var work3 = new Work('work3')
 var work4 = new Work('work4')
 mySecondFlow.add(work3)
 mySecondFlow.add(work4)
 myFlow.add(mySecondFlow)
 var work5 = new Work('work5')
 var work6 = new Work('work6')
 myFlow.add(work5, work6)
 var myThirdFlow = new Flow('myThirdFlow')
 myThirdFlow.add(work1, work2, mySecondFlow, work5, work6)
 myFlow.add(myThirdFlow)
 myFlow.go()
