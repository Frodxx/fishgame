//jquery

$(document).ready(function(){
			var IP = '10.12.129.75';
			var port = '8080';
			var ws = 'ws://' + IP + ':' + port
			console.log(ws);
			var conn = new WebSocket(ws);

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
				$('#chatbox').append('<div class="bg-info">' + timestamp() + 'Connected.</div>');
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
						window.mydetaccum = [0];
						window.myturn = false;

						$('#chatbox').append('<div>You are <span style="font-weight: bold;color:#' +mycolor+'">'+myuser + '</span>.<hr></div>');
						break;

					case 'text':
						if (window.playing == false){
							$('#chatbox').append("<div>"+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span>: "+rcvdmessage+"</div>");
							scrollAnimation();
						}
						break;

					case 'join':
						if (window.playing == false){
							$('#chatbox').append('<div class="bg-success">'+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span> has joined the room.</div>");
							scrollAnimation();
						}
						break;

					case 'part':
						if (window.playing == false){
							$('#chatbox').append('<div class="bg-warning">'+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span> has left the room.</div>");
							scrollAnimation();	
						}
						else{
							$('#notify').html('<div class="bg-warning">'+timestamp()+'<span style="font-weight: bold;color:#' +ucolor+'">'+uname + "</span> has left the room and the game had to be interrupted.</div>");
							setTimeout(function(){
								$('#notify').html('Restarting...')},2000);
							setTimeout(function(){location.reload(true)}, 3500);
						}
						break;

					case 'action':
						if (window.playing == false){
							$('#chatbox').append("<div>"+timestamp()+'<span style="font-weight: bold;font-style:italic;color:#' +ucolor+'">'+uname + '</span> <span style="font-style:italic;">'+rcvdmessage+"</span></div>");
							scrollAnimation();
						}
						break;

					case 'ready':
						if (window.playing == false){
							$('#chatbox').append("<div>"+timestamp()+'<span style="font-style:italic"><span style="font-weight: bold;color:#' +ucolor+'">'+uname + '</span> is ready</span></div>');
							scrollAnimation();
						}
						break;

					case 'unready':
						if (window.playing == false){
							$('#chatbox').append("<div>"+timestamp()+'<span style="font-style:italic"><span style="font-weight: bold;color:#' +ucolor+'">'+uname + '</span> is no longer ready</span></div>');
							scrollAnimation();
						}
						break;

					case 'users':
						if (window.playing == false) {
							var names = msg.names;
							var colors = msg.colors;
							$('#chatbox').append('<div class="bg-info" id="users">' + timestamp() + 'Connected users: </div>');
							for (var i = 0; i < names.length; i++){
								$('#users').append('<span style="font-weight:bold;color:#'+colors[i]+'">'+names[i]+'</span> ');
							}
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
							resetUI();
							blockUI();
							$('#notify').html('It is <span style="font-weight:bold;color:#' + ucolor + '">' + uname + "</span>'s turn!");
						}
						break;

					case 'catch':
						window.pop -= rcvdmessage;
						//window.detpop.push(window.pop);

						if (uname != window.myuser){
							$('#notify').html('<span style="font-weight:bold;color:#' + ucolor + '">' + uname + "</span> caught " + rcvdmessage+" units!");
							$('.container').find(".fishy:nth-last-child(-n+"+rcvdmessage+ ")").remove();
						}
						break;

					case 'repop':
						window.pop = rcvdmessage;
						window.detpop.push(window.pop);
						buildPlayground();
						break;

					case 'over':
						window.playing = false;
						var catches = msg.catches;
						var names = msg.names;
						var colors = msg.colors;
						var players = colors.length;

						var mypos = names.indexOf(window.myuser);

						buildLobby();
						$('#chatbox').append('<h3>Game over!</h3>');
						$('#chatbox').append('<div>You fished <strong>' + catches[mypos].length + '</strong> times, and caught '+ window.myaccum +' units overall.</div>');
						$('#chatbox').append('<div>The score for all players is as follows:</div><br>');
						for (var i = 0; i < catches.length; i++) {
							// if (catches[i] == mypos){
							// 	//print in bold
							// 	$('#chatbox').append('<div style:"font-weight:bold"><span style="color:#'+mycolor+'">'+names[mypos]+'</span>: '+ window.myaccum +' units – ' + catches[i] +'</div>');
							// }
							//else{
								$('#chatbox').append('<div><span style="font-weight:bold;color:#'+colors[i]+'">'+names[i]+'</span>: '+ catches[i].reduce(function(a,b){return parseInt(a) + parseInt(b)}) +' units – ' + catches[i] +'</div>');
							//}
						};
						

						// $('#chatbox').append('<div id="placeholder" style="width:700px;height:350px;"></div>');

						// $.getScript("jquery.flot.js", function(){
						// 	var options = {
						// 		series: {
						// 			lines: {show: true},
						// 			points: {show: true}
						// 		},
						// 		xaxis: {
						// 			ticks: 10,
						// 			min: 1,
						// 			max: 10,
						// 			tickDecimals: 0
						// 		},
						// 		yaxis: {
						// 			ticks: 4,
						// 			min: 0,
						// 			max: 3,
						// 			tickDecimals: 0
						// 		}
						// 	};

						// 	var catchy = []; //aux
						// 	window.new_catches = new Array();

						// 	for (var i = 0; i < catches.length; i++) {
						// 		console.log(catches[i]);
						// 		for (var j = 0; j < catches[i].length; j++) {
						// 			console.log(catches[i][j]);
						// 			catchy.push([j+1, parseInt(catches[i][j])]);
						// 		}

						// 		var myobject = {
						// 			label: names[i],
						// 			color: "#" + colors[i],
						// 			data: catchy
						// 		};

						// 		window.new_catches.push(myobject);
						// 		catchy = [];
						// 	}
						// 	// all_new_array = [];
						// 	// for (var i = 0; i < window.new_catches.length; i++) {
						// 	// 	all_new_array.push(window.new_catches[i]);
						// 	// }
						// 		$.plot($('#placeholder'), window.new_catches, options);
						// 	});

						$('#chatbox').append('<hr>');
						resetValues();
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
								window.maxpop = window.pop;
								window.detpop = [window.maxpop];
								gameInit();
							}, 3000);
						}
						break;
					}
			}


			conn.onclose = function(e){
				console.log("Socket connection ended.");
				if (window.playing == false) {
					$('#chatbox').append('<div class="bg-danger">'+timestamp()+'Disconnected.</div>');
					$('#chatInput').prop('disabled', true);
				}
				else{
					blockUI();
					$('#notify').html('<div class="bg-danger">'+timestamp()+'Disconnected.</div>');
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

					case "users":
						msg = {
							type: 'users'
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
				buildPlayground();
				setListening();
			}

			buildPlots = function(){
				$.getScript("jquery.flot.js", graphy01);
				$.getScript("jquery.flot.js", graphy02);
			}

			buildPlayground = function(){
				$('.container').html("");

				$('.container').append('<div id="buttonBar"></div>');
				$('#buttonBar').append('<p id="notify" class="bg-warning"></p>');

				if (window.matchMedia("(min-width: 1025px)").matches){
					//1025 or more

					$('#buttonBar').css({
						'position' : 'absolute',
						'min-width' : '995px',
						'margin-top' : '720px'
					});

					$('.container').append('<div class="well pull-right" id="graphies"></div>');
					$('#graphies').css({
						'width' : '35%',
						'height' : '700px',
						'margin' : '1% 0 1% 0'
					});

					$('#graphies').append('<div id="graphy01"></div><div id="graphy02"></div>');

					$('#graphy01').css({
						'height' : '49%'
					});

					$('#graphy02').css({
						'height' : '49%'
					});

					buildPlots();				
				}

				else{
					//1024 or less
					$('#buttonBar').css({
						'position' : 'absolute',
						'min-width' : '995px',
						'margin-top' : '660px'
					});

					$('.container').append('<div class="well pull-right" id="graphies"></div>');
					$('#graphies').css({
						'width' : '35%',
						'height' : '640px',
						'margin' : '1% 0 1% 0'
					});

					$('#graphies').append('<div id="graphy01"></div><div id="graphy02"></div>');

					$('#graphy01').css({
						'height' : '49%'
					});

					$('#graphy02').css({
						'height' : '49%'
					});

					buildPlots();
				}


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

				$('#buttonBar').append('<p id="catchy" class="bg-success pull-right">Global catch <span class="badge">'+window.myaccum+'</span></p>');

				$('#catchy').css({
					'border-radius' : '0.3em',
					'padding': '7px',
					'margin-right': '15px'
				});
				
				for (var i = 0; i < window.pop; i++) {
					$('.container').append('<img class="fishy" src="img/fish.png">');
				}

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

			//graphy01

			graphy01 = function(){
				var options = {
					series: {
						lines: {show: true}
					},
					xaxis: {
						show: true,
						ticks: 20, //this depends on number of players
						tickDecimals: 0,
						min: 0,
						max: 20, //this also depends on number of players
						tickFormatter: function(val, ax){return ""}
					},
					yaxis: {
						show: true,
						ticks: 20, //this depends on number of players and rounds
						tickDecimals: 0,
						min: 0,
						max: 20, //this also depends on number of players and rounds
						tickFormatter: function(val, ax){return ""}
					},
				};

				var treateddetcatch = new Array();

				for (var i = 0; i < window.mydetaccum.length; i++) {
					treateddetcatch.push([i, window.mydetaccum[i]]);
				};

				var myobject = {
					color: "#" + window.mycolor,
					data: treateddetcatch
				};

				$.plot($('#graphy01'), [myobject], options);
			}

		//graphy02

		graphy02 = function(){
			var options = {
				series: {
					lines: {show: true},
				},
				xaxis: {
					show: true,
					min: 0,
					ticks: 20, //this should be exactly the same as it was for graphy01
					max: 20, //same here
					tickDecimals: 0,
					tickFormatter: function(val, ax){return ""}
				},
				yaxis: {
					min: 0,
					ticks: 20, //this should be exactly the same as it was for graphy01
					max: 40, //but this should be any number (around twice as much as max population) which mod equals 0, that is max % ticks == 0
					show: true,
					tickDecimals: 0,
					tickFormatter: function(val, ax){return ""}
				}
			};

			var treateddetpop = new Array();

			for (var i = 0; i < window.detpop.length; i++) {
				treateddetpop.push([i, window.detpop[i]]);
			};

			var myobject = {
				color: "red",
				data: treateddetpop
			};

			$.plot($('#graphy02'), [myobject], options);
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
				window.myturn = false;
				console.log(window.pop);
				console.log(window.detpop);
				blockUI();
					msg = {
							type: 'end',
							name: window.myuser,
							color: window.mycolor,
							message: window.mycatch
						};
				conn.send(JSON.stringify(msg));
				window.myaccum += window.mycatch;
				window.mydetaccum.push(window.myaccum);
				console.log(mydetaccum);
				buildPlots();
				//resetUI();
			}

			resetValues = function(){
				window.mycatch = 0;
				window.myaccum = 0;
				window.myturn = false;
				window.mydetaccum = [0];
			}

			buildLobby = function(){
				$('body').html("");

				$('.container').css({
					'background-image' : 'none',
					'background-size' : 'auto'
				});

				$('body').html('<div class="container"><div class="page-header"><h1>The Fishgame <small>Room</small></h1></div><div id="chatContainer" class="well"><div id="chatbox">Welcome to the room! All messages will appear here.</div><div class="controls"><form><div class="form-group">	<label class="sr-only" for="chatInput">Message</label><input type="text" class="form-control" id="chatInput" placeholder="Message" maxlength="100">	</div><button id="sendButton" type="button" class="btn btn-default">Send</button><input id="readyCheck" class="pull-right" type="checkbox" data-size="normal" data-on="Ready!" data-off="Ready?" data-onstyle="success" data-toggle="toggle"></form></div></div></div>');
				
				var stylesheets = $('link[href="sitewide.css"]');
				var reloadQueryString = '?reload=' + new Date().getTime();
				stylesheets.each(function () {
					this.href = this.href.replace(/\?.*|$/, reloadQueryString);
						});

				$('#sendButton').css({
					'margin-left': '5px',
					'margin-right' : '5px'
				});

				$('#chatbox').append('<div>You are <span style="font-weight: bold;color:#' +mycolor+'">'+myuser + '</span>.<hr></div>');
				$('#readyCheck').bootstrapToggle("off");
				$('#sendButton').click(sendMsg);
				$('#readyCheck').change(setReady);
				
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