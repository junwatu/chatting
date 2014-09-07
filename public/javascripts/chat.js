var chatInfra = io.connect('/chat_infra'),
    chatCom = io.connect('/chat_com');

chatInfra.on('name_set', function(data) {
	$('#modal').modal('hide');
	$('#messages').append('<div class="systemMessage">' + 'Hello ' + data.name + '</div>');

	/*User Interface element's event handlers for id=message*/
	$('#message').keypress(function(event) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
		//event.which = untuk mozilla
		if(keycode == '13') {
			var data = {
				message: $('#message').val(),
				type:'userMessage'
			};
			chatCom.send(JSON.stringify(data));
			$('#message').val('');
		}
	});

	chatInfra.on('message', function(data) {
		data = JSON.parse(data);
		$('#messages').append('<div class="' + data.type + '">' + data.message + '</div>');
		$('#messages').scrollTop(1000);
	});

	chatCom.on('message', function(message) {
		var message = JSON.parse(message);
		$('#messages').append('<div class="' + message.type + '">' + 
			'<span class="name">' + message.username + ": </span>" + 
			message.message + '</div>'
		);
		$('#messages').scrollTop(1000);
	});

	chatInfra.on('user_entered', function(data) {
		$('#messages').append('<div class="' + data.type + '">' + data.name + 
			' has joinned room</div>');
	});

	chatInfra.on('user_disconnect', function(data) {
		$('#messages').append('<div class="' + data.type + '">' + data.name + 
			' has left chat</div>');
	});
});

/*document ready handlers*/
$(function() {
	$('#modal').modal({
		show:true
	});

	/*User Interface element's event handlers for id=setname*/
	$('#setname').click(function() {
		chatInfra.emit('set_name', { name: $('#nickname').val() } );
	});
});
