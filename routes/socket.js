/*var io = require('socket.io');
var socketHandshake = require('socket.io-handshake');*/

exports.initialize = function(io) {
	//io = io.listen(server);
	
	/*namespace chat_infra*/
	var chatInfra =  io.of('/chat_infra').on('connection', function(socket) {
		socket.on('set_name', function(data) {
			console.log('data: '+data);
			/*socket['nickname'] = data.name;*/
			socket.handshake.session.name = data.name;
			socket.handshake.session.save();
			socket.emit('name_set', data);
			socket.send(JSON.stringify({
				type: 'serverMessage',
				message: '#=====w.e.l.c.o.m.e=====#'
			}));
			data.type = 'serverMessage';
			socket.broadcast.emit('user_entered', data);

			socket.on('disconnect', function() {
				socket.broadcast.emit('user_disconnect', data);
			});/*di client tambahi event disconnect jg, jadi emit event disconnect yg di server*/
		});
	});

	/*namespace chat_com*/
	var chatCom = io.of('/chat_com').on('connection', function(socket) {
		socket.on('message', function(message) {
			message = JSON.parse(message);	
			if(message.type == 'userMessage') {
				message.username = socket.handhsake.session.name;
				/*message.username = socket['nickname'];*/
				socket.broadcast.send(JSON.stringify(message));
				message.type = 'myMessage';
				socket.send(JSON.stringify(message))
			}
		});
	});
};