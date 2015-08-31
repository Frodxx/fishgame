//jquery

$(document).ready(function(){
			var IP = 'ws://10.12.129.75:8080';
			var conn = new WebSocket(IP);

			scrollAnimation = function(){
				$('#chatbox').stop().animate({
						scrollTop: $('#chatbox')[0].scrollHeight}, 800
					);
			}

			
			timestamp = function(){
				var time = new Date();
				var mins = ('0'+time.getMinutes()).slice(-2);
				return "[" + time.getHours() + ":" + mins + "]  ";
			}


			conn.onopen = function(e){
				$('#chatbox').append('<div class="bg-info">' + timestamp() + 'Conectado.</div>');
				window.playing = false;
			}


			conn.onmessage = function(e){
				var msg = JSON.parse(e.data);
				var msgtype = msg.type;
				var rcvdmessage = msg.message;
				var uname = msg.name;
				var ucolor = msg.color;

				console.log(msg); //debug

				switch(msgtype) {

					case 'system':
						if (window.playing == false){
							$('#chatbox').append("<div>"+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span>: "+rcvdmessage+"</div>");
							scrollAnimation();
						}
						else{
							$('#notify').html("<div>"+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span>: "+rcvdmessage+"</div>");
						}
						break;

					case 'handshake':
						window.myid = rcvdmessage;
						window.myuser = uname;
						window.mycolor = ucolor;
						window.mycatch = 0;
						window.myaccum = 0;
						window.myturn = false;

						$('#chatbox').append('<div>Tu nombre es <span style="font-weight: bold;color:#' +mycolor+'">'+myuser + '</span>.<hr></div>');
						break;

					case 'text':
						if (window.playing == false){
							$('#chatbox').append("<div>"+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span>: "+rcvdmessage+"</div>");
							scrollAnimation();
						}
						break;

					case 'join':
						if (window.playing == false){
							$('#chatbox').append('<div class="bg-success">'+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span> se ha unido a la sala.</div>");
							scrollAnimation();
						}
						break;

					case 'part':
						if (window.playing == false){
							$('#chatbox').append('<div class="bg-warning">'+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span> ha salido de la sala.</div>");
							scrollAnimation();	
						}
						else{
							$('#notify').html('<div class="bg-warning">'+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span> ha salido de la sala y el juego tuvo que cancelarse.</div>");
							setTimeout(function(){
								$('#notify').html('Reiniciando el juego...')},2500);
							setTimeout(function(){location.reload(true)}, 4500);
						}
						break;

					case 'action':
						if (window.playing == false){
							$('#chatbox').append("<div>"+timestamp()+'<span style="font-weight: bold;font-style:italic;color:#' +ucolor+'">'+uname + '</span> <span style="font-style:italic;">'+rcvdmessage+"</span></div>");
							scrollAnimation();
						}
						break;

					case 'ready':
						if (window.playing==false){
							$('#chatbox').append("<div>"+timestamp()+'<span style="font-style:italic"><span style="font-weight: bold;color:#' +ucolor+'">'+uname + '</span> <span style="font-style:italic;"></span>est&aacute; listo</div></span>');
							scrollAnimation();
						}
						break;

					case 'unready':
						if (window.playing == false){
							$('#chatbox').append("<div>"+timestamp()+'<span style="font-style:italic"><span style="font-weight: bold;color:#' +ucolor+'">'+uname + '</span> <span style="font-style:italic;"></span>dejó de estar listo</div></span>');
							scrollAnimation();
						}
						break;

					case 'turn':
						if(rcvdmessage == window.myid){
							//it is my turn
							window.myturn = true;
							resetUI();
							$('#notify').html("It is your turn!");
						}
						else{
							$('#notify').html('It is <span style="font-weight:bold;color:#' + ucolor + '">' + uname + "</span>'s turn!");
						}
						break;

					case 'catch':
						window.pop -= rcvdmessage;

						if (uname != window.myuser){
							$('#notify').html('<span style="font-weight:bold;color:#' + ucolor + '">' + uname + "</span> caught " + rcvdmessage+" units!");
							$('.container').find(".fishy:nth-last-child(-n+"+rcvdmessage+ ")").remove();
						}
						break;

					case 'repop':
						window.pop = rcvdmessage;
						buildPlayground();
						break;

					case 'over':
						window.playing = false;
						var catches = msg.catches;
						var names = msg.names;
						var colors = msg.colors;
						var players = colors.length;

						buildLobby();
						$('#chatbox').append('<div id="placeholder" style="width:700px;height:350px;"></div>');

						// $.getScript("jquery.flot.js", function(){
						// 	var options = {
						// 		series: {
						// 			lines: {show: true},
						// 			points: {show: true}
						// 		}
						// 	};

						// 	var catchy = []; //aux
						// 	var new_catches = [];

						// 	for (var i = 0; i <= catches.length; i++) {
						// 		for (var j = 0; j <= catches[i].length; i++) {
						// 			catchy.push(i+1, catches[i][j]);
						// 		};
						// 		new_catches.push(catchy);
						// 	};

						//   $.plot($('#placeholder'), [new_catches], options);
						// 	});
						break;


					case 'start':

						if (window.playing == false){
							window.playing = true;
							$('#readyCheck').attr("data-onstyle", "default");
							$('#readyCheck').attr("disabled", true);

							$('#chatbox').append("<div>"+timestamp()+'<span style="font-style:italic"><span style="font-weight: bold;color:#999999">System</span>: 3</div>');

							setTimeout(function(){
								$('#chatbox').append("<div>"+timestamp()+'<span style="font-style:italic"><span style="font-weight: bold;color:#999999">System</span>: 2</div>');
							}, 1000);

							setTimeout(function(){
								$('#chatbox').append("<div>"+timestamp()+'<span style="font-style:italic"><span style="font-weight: bold;color:#999999">System</span>: 1</div>');
							}, 2000);

							setTimeout(function(){
								window.pop = rcvdmessage;
								gameInit();
							}, 3000);
						}
						break;
					}
			}


			conn.onclose = function(e){
				console.log("Socket connection ended.");
				if (window.playing == false) {
					$('#chatbox').append('<div class="bg-danger">'+timestamp()+'Desconectado.</div>');
					$('#chatInput').prop('disabled', true);
				}
				else{
					blockUI();
					$('#notify').html('<div class="bg-danger">'+timestamp()+'Desconectado.</div>');
				}
			}


			sendMsg = function(){

				if ($('#chatInput').val().trim().length != 0){

					if ($('#chatInput').val()[0] == "/") {
						//this is a command
						var userinput = $('#chatInput').val();
						if (userinput.indexOf(" ") > -1) {
							var command = userinput.substring(1,userinput.indexOf(' '));
						}
						else {
							var command = userinput.substring(1);
						}

						executeCmd(command);
					}

					else{
						var msg = {
							type: 'text',
							name: window.myuser,
							color: window.mycolor,
							message: $('#chatInput').val()
						};

						conn.send(JSON.stringify(msg));
						$('#chatInput').val('');
					}
				}
			}


			executeCmd = function(command){

				switch (command) {

					case "cls":
					case "clear":
						$('#chatInput').val('');
						$('#chatbox').html("");
						break;

					case "me":
						var userinput = $('#chatInput').val();
						var action = userinput.slice(4);

						msg = {
							type: 'action',
							name: window.myuser,
							color: window.mycolor,
							message: action
						};

						conn.send(JSON.stringify(msg));
						$('#chatInput').val('');
						break;

					case "ready":
					case "rdy":
						if ($('#readyCheck').prop("checked")){
							$('#readyCheck').bootstrapToggle('off');
						}
						else{
							$('#readyCheck').bootstrapToggle('on');
						}
						$('#chatInput').val('');
						break;
				}
			}


			setReady = function(){
				msg = {
					type: 'ready',
					name: window.myuser,
					color: window.mycolor,
				};

				conn.send(JSON.stringify(msg));
				$('#chatInput').val('');
			}


			$('#chatInput').keypress(function(e){
				if (e.which == 13) {
					sendMsg();
					return false;
				}
			});


			gameInit = function(){
				window.playing = true;
				buildPlayground(); //just for showing off purposes
				blockUI();
				setListening();
			}

			buildPlayground = function(){
				$('.container').html("");

				if (window.matchMedia("(min-width: 1025px)").matches){
					//1025 or more
					$('.container').css({
						"display": "block",
						"background-image":"url('img/retbg.jpg')",
						"width" : "1024px",
						"min-height" : "768px",
						"background-size" : "1024px 768px"
					});
				}
				else{
					//1024 or less
					$('.container').css({
						"display": "block",
						"position": "relative",
						"background-image":"url('img/retbg.jpg')",
						"background-size" : "1024px 710px",
						"width" : "100%",
						"min-height" : "705px"
					});
				}

				$('.container').append('<div id="buttonBar"></div>')

				$('#buttonBar').append('<p id="notify" class="bg-warning"></p>');

				$('#buttonBar').css({
					'position' : 'absolute',
					'min-width' : '995px',
					'margin-top' : '720px'
				});

				$('#notify').css({
					'border-radius' : '0.3em',
					'padding': '7px',
					'display' : 'inline-block'
				});

				$('#buttonBar').append('<button id="endBtn" class="btn btn-info pull-right">Fin</button>');

				$('#endBtn').css({
					'min-width' : '100px'
				});

				$('#buttonBar').append('<button id="resetBtn" class="btn btn-warning pull-right">Reset</button>');

				$('#resetBtn').css({
					'min-width' : '100px',
					'margin-right' : '15px'
				});
				
				for (var i = 0; i < window.pop; i++) {
					$('.container').append('<img class="fishy" src="img/fish.png">');
				}

				$

				$('#amigo').css({
					'-moz-transform': 'scaleX(-1)',
        		'-o-transform': 'scaleX(-1)',
        		'-webkit-transform' : 'scaleX(-1)',
        		'transform': 'scaleX(-1)',
        		'filter' : 'FlipH',
        		'-ms-filter' : 'FlipH'});			
				$('.fishy').draggable();				
				$('#endBtn').click(imDone);
				$('#resetBtn').click(resetUI);

				blockUI();

				if (window.myturn){
					$('#notify').html("It is your turn!");
					unblockUI();
				}
			}

			resetUI = function(){
				buildPlayground();
				window.mycatch = 0;	
			}

			poof = function(){
				if (window.mycatch < 3) {
					$(this).css("visibility", "hidden");
					window.mycatch += 1;
					$('#notify').html('You caught <span style="font-weight:bold">' + window.mycatch + "</span>!");
				}
				else{
					$('.fishy').off("click");
					$('.fishy').draggable("disable");
				}
			}

			blockUI = function(){
				$('.fishy').off("click");
				$('.fishy').draggable("disable");
				$('.btn').attr('disabled','disabled');
			}

			unblockUI = function(){
				$('.fishy').click(poof);
				$('.fishy').draggable("enable");
				$('.fishy').draggable({
					containment: "parent"
				});
				$('.btn').removeAttr('disabled');
			}

			setListening = function(){
				//send message UI is now blocked
				msg = {
							type: 'listen',
							name: window.myuser,
							color: window.mycolor,
						};

				conn.send(JSON.stringify(msg));
			}

			imDone = function(){
				 msg = {
				 		type: 'end',
				 		name: window.myuser,
				 		color: window.mycolor,
				 		message: window.mycatch
				 	};
				conn.send(JSON.stringify(msg));
				blockUI();
				window.myaccum += window.mycatch;
			}

			buildLobby = function(){
				$('.container').html("");
				$('.container').html('<div class="page-header"><h1>The Fishgame <small>Room</small></h1></div><div id="chatContainer" class="well"><div id="chatbox">&iexcl;Bienvenido a la sala! Aqu&iacute; aparecer&aacute;n los mensajes.</div><div class="controls"><form><div class="form-group"><label class="sr-only" for="chatInput">Mensaje</label><input type="text" class="form-control" id="chatInput" placeholder="Mensaje" maxlength="100"></div><button id="sendButton" type="button" class="btn btn-default">Enviar</button></form></div></div>');
				$('#chatbox').append('<div>Tu nombre es <span style="font-weight: bold;color:#' +mycolor+'">'+myuser + '</span>.<hr></div>');
				$('#sendButton').click(sendMsg);
				
				$('#chatInput').keypress(function(e){
					if (e.which == 13) {
						sendMsg();
						return false;
					}
				});
			}

			$('#readyCheck').bootstrapToggle("off");
			$('#sendButton').click(sendMsg);
			$('#readyCheck').change(setReady);
		});