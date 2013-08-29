//引入程序包
var express = require('express')
  , path = require('path')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , worker = require('child_process');

//设置日志级别
// io.set('log level', 1); 


var sysstat = function(callback){
  var cpu ="sar -u 1 1 | grep Average | awk '{print $8}'"; 
  var mem ="sar -r 1 1 | grep Average | awk '{print $4}'";
  worker.exec(cpu, function (error1, stdout1, stderr1) {      
      worker.exec(mem, function (error2, stdout2, stderr2) {
        //console.log('CPU: ' + stdout1+',MEM: ' + stdout2);
        callback({cpu:stdout1,mem:stdout2});
      });    
  });
}
  

//WebSocket连接监听
io.on('connection', function (socket) {
  //socket.emit('open');//通知客户端已连接

  // 打印握手信息
  // console.log(socket.handshake);

  function send(obj){
    var sys = {
      time:(new Date()).getTime(),
      cpu:(100-parseFloat(obj.cpu)),
      mem:parseFloat(obj.mem)
    }
    socket.emit('system', sys);
  }

  setInterval(function(){
    sysstat(send);
  },1000);
  
  // 对message事件的监听
  socket.on('message', function(msg){
  });

  //监听出退事件
  socket.on('disconnect', function () {  
  });
});



//express基本配置
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// 指定webscoket的客户端的html文件
app.get('/', function(req, res){
  res.sendfile('views/alert.html');
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


