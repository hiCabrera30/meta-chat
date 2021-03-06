var mysql = require('mysql');
var fs = require("fs");
var users = {};
var socketIds = {};
var file = {};

module.exports = function(app){
  
  var io = require('socket.io')(app);
  var onBucket = [];
  return {
    on: function(name, fn){
      onBucket.push({
        name: name,
        fn: fn
      }); 
    },
    init: function(config) {
      config.host = config.host.indexOf('http://') == 0
        ?  config.host.replace('http://', '') : config.host,
      config.assets = config.assets || '';
      var connection = mysql.createConnection({
        host     : config.host,
        user     : config.user,
        password : config.password,
        database : config.database,
        charset  : 'utf8mb4'
      });


      connection.connect();

      io.on('connection', function (socket) {
        socket.emit('conected', { msg: 'world' });

        
        socket.on('createSession', function (data) {
          users[data.userId] = {
            socketid : socket.id,
            name: data.name
          };

          socketIds[socket.id] = data.userId;
          socket.broadcast.emit('user_online_state', { userId: data.userId, is_online: true });

        });

        socket.on('typing', function( data ){
          if(users.hasOwnProperty(data.toId)) {
            socket.broadcast.to(users[data.toId].socketid).emit('friend_typing', data);
          }
        });

        socket.on('upload_file', function(data, cb){
          
          if(!data.hasOwnProperty('onse')) {
            cb(false);
          }
          if(!file.hasOwnProperty(data.onse)) {
            file[data.onse] = {
              fileType : data.type.split('/')
            };
            
            file[data.onse].name = (new Date()).getTime() +'.'+ file[data.onse].fileType[1];
            // file[data.onse].path = '';
            file[data.onse].path = config.assets + '/';
            file[data.onse].fullPath = file[data.onse].path + file[data.onse].name;
          }

          var base64Data = data.data.replace(/^data:([A-Za-z-+\/]+);base64,/, "");

          fs.appendFile(config.storagePath + '/' + file[data.onse].fullPath, base64Data, 'base64', function(err) {
            console.log(err);
            
            cb(file[data.onse]);
          });

        });

        socket.on('disconnect', function(){
          if(socketIds.hasOwnProperty(socket.id)) {
            socket.broadcast.emit('user_online_state', { userId: socketIds[socket.id], is_online: false });

            if(users.hasOwnProperty(socketIds[socket.id])) {
              delete users[socketIds[socket.id]];
            }
            delete socketIds[socket.id];
          }
        });

        // registered listener
        onBucket.forEach(item => {
          socket.on(item.name, item.fn);
        });

        socket.on('get_history', function(data, callback){

            if(!data.lastId) {
              data.lastId = 1000000000000;
            }
            data.perPage = data.perPage || 20;
            connection.query(`SELECT * FROM messages WHERE ( (userId=? AND toId=?) OR (userId=? AND toId=?) ) AND id<? ORDER BY id DESC LIMIT ?`, [data.userId, data.toId, data.toId, data.userId, data.lastId, data.perPage], function (error, results, fields) {
              if (error) throw error;
              callback({ messages: results });
            });
        });

        socket.on('is_online', function( data, callback ) {

          if(typeof callback === 'function') {
            if(users.hasOwnProperty(data.id)) {
              callback({is_online: true});
            } else {
              callback({is_online: false});
            }
          }

        });

        socket.on('send', function(data) {
          console.log(data);
          
          data.name = users[data.userId].name;
          data.type = data.type || 0;

          connection.query('INSERT INTO messages SET ?', {
            userId: data.userId,
            toId: data.toId,
            // msg: data.type
            //   ? (config.imagePath.indexOf('http://') == 0 ?  '' : 'http://') + config.imagePath + '/' + data.msg
            //   : data.msg, // alter
            msg: data.msg,
            type: data.type
          }, function (error, results, fields) {
            if (error) throw error;
            
          });

          if(users.hasOwnProperty(data.toId)) {
            socket.broadcast.to(users[data.toId].socketid).emit('message', data);
          }
          // 
        });

        socket.on('send_image', function(data) {
                    
          connection.query('INSERT INTO messages SET ?', {
            userId: data.userId,
            toId: data.toId,
            // msg: data.type
            //   ? (config.imagePath.indexOf('http://') == 0 ?  '' : 'http://') + config.imagePath + '/' + data.msg
            //   : data.msg, // alter
            msg: data.msg
          }, function (error, results, fields) {
            if (error) throw error;  
          });

        });


      });
    }
  }
}
