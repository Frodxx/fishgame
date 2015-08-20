//jquery

$(document).ready(function(){

			var conn = new WebSocket('ws://10.12.131.57:8080');

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
						$('#chatbox').append("<div>"+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span>: "+rcvdmessage+"</div>");
						scrollAnimation();
						break;

					case 'handshake':
						window.myuser = uname;
						window.mycolor = ucolor;
						window.mycatch = 0;

						$('#chatbox').append('<div>Tu nombre es <span style="font-weight: bold;color:#' +mycolor+'">'+myuser + '</span>.<hr></div>');
						break;

					case 'text':
						$('#chatbox').append("<div>"+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span>: "+rcvdmessage+"</div>");
						scrollAnimation();
						break;

					case 'join':
						$('#chatbox').append('<div class="bg-success">'+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span> se ha unido a la sala.</div>");
						scrollAnimation();
						break;

					case 'part':
						$('#chatbox').append('<div class="bg-warning">'+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span> ha salido de la sala.</div>");
						scrollAnimation();
						break;

					case 'action':
						$('#chatbox').append("<div>"+timestamp()+'<span style="font-weight: bold;font-style:italic;color:#' +ucolor+'">'+uname + '</span> <span style="font-style:italic;">'+rcvdmessage+"</span></div>");
						scrollAnimation();
						break;

					case 'ready':
						$('#chatbox').append("<div>"+timestamp()+'<span style="font-style:italic"><span style="font-weight: bold;color:#' +ucolor+'">'+uname + '</span> <span style="font-style:italic;"></span>est&aacute; listo</div></span>');
						scrollAnimation();
						break;

					case 'unready':
						$('#chatbox').append("<div>"+timestamp()+'<span style="font-style:italic"><span style="font-weight: bold;color:#' +ucolor+'">'+uname + '</span> <span style="font-style:italic;"></span>dejó de estar listo</div></span>');
						scrollAnimation();
						break;

					case 'turn':
						if(uname == window.myuser){
							//it is my turn
							unblockUI();
						}
						break;

					case 'start':

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
							gameInit();
						}, 3000);
						break;

					}
			}


			conn.onclose = function(e){
				$('#chatbox').append('<div class="bg-danger">'+timestamp()+'Desconectado.</div>');
				$('#chatInput').prop('disabled', true);
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
				showcase(); //just for showing off purposes
				blockUI();

				//send message UI is now blocked
				msg = {
							type: 'listen',
							name: window.myuser,
							color: window.mycolor,
						};

				conn.send(JSON.stringify(msg));
			}


			showcase = function(){
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

				$('.container').append('<img id="amigo" class="fishy" src="img/fish.png">');
				for (var i = 0; i < 10; i++) {
					$('.container').append('<img class="fishy" src="img/fish.png">');
				};

				$('#amigo').css({
					'-moz-transform': 'scaleX(-1)',
        		'-o-transform': 'scaleX(-1)',
        		'-webkit-transform' : 'scaleX(-1)',
        		'transform': 'scaleX(-1)',
        		'filter' : 'FlipH',
        		'-ms-filter' : 'FlipH'});

				$('.fishy').draggable();

				$('.container').append('<button id="end" class="btn btn-info pull-right">Fin</button>');
				
				$('#end').css({
					'min-width' : '100px',
					'margin-top': '520px'
				})
				
				}

			poof = function(){
				$(this).css("visibility", "hidden");
				window.mycatch += 1;
			}

			blockUI = function(){
				$('.fishy').off("click");
				$('.fishy').draggable("disable");
			}

			unblockUI = function(){
				$('.fishy').on("click", poof);
				$('.fishy').draggable({
					containment: "parent"
				});
				$('.fishy').draggable("enable");
			}

			imDone = function(){
				// msg = {
				// 		type: 'end',
				// 		name: window.myuser,
				// 		color: window.mycolor,
				// 		message: window.mycatch
				// 	};
				// conn.send(JSON.stringify(msg));
				blockUI();
			}

			//$('#end').click(console.log("holi"));


			$('#readyCheck').bootstrapToggle("off");

			$('#sendButton').click(sendMsg);
			$('#readyCheck').change(setReady);
		});