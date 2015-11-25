$(document).ready(function(){

	var IP = '10.12.129.75';
	var port = '8080';
	var ws = 'ws://' + IP + ':' + port
	console.log(ws);
	var conn = new WebSocket(ws);
	window.drawing = false;
	window.groupy01 = false;
	window.groupy02 = false;
	window.playing = false;

	$('.container').append('<section id="graph02" class="row graph-group"><h3>Graph Group 2</h3><div class="collapsible"><input id="stats03" checked="checked" class="ml" type="radio" name="statgroup02" value="stats03"> Players<div class="cb pt"></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 1" value="1"> <span id="p21">Dynamically Generated Player Name</span></label></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 2" value="2"> <span id="p22">Dynamically Generated Player Name</span></label></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 3" value="3"> <span id="p23">Dynamically Generated Player Name</span></label></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 4" value="4"> <span id="p24">Dynamically Generated Player Name</span></label></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 5" value="5"> <span id="p25">Dynamically Generated Player Name</span></label></div><div class="cb pt"></div><input id="stats04" class="ml" type="radio" name="statgroup02" value="stats04"> Other Stats<div class="cb pt"></div><div class="col-xs-12 col-sm-6"><label class="group04"><input class="group04" type="radio" name="charts" value="pop"> Population</label></div><div class="col-xs-12 col-sm-6"><label style="visibility:hidden" class="group04"><input class="group04" type="radio" name="charts" value="catches"> Catch Distribution</label></div><button type="button" id="go02" class="btn btn-success fr mar">Go!</button><button id="del" type="button" class="btn btn-danger fr mar">Delete</button></div><div class="cb pt"></div></section>');
	$('#graph02').css("visibility", "hidden");

	conn.onopen = function(e){
		console.log("Connected.")
		console.log(e);
		var msg = {type: 'statInit'};
		conn.send(JSON.stringify(msg));
	}

	conn.onmessage = function(e){
		var msg = JSON.parse(e.data);
		var msgtype = msg.type;
		var rcvdmessage = msg.message;
		var ucolor = msg.color;
		var uname = msg.name;

		console.log(msg); //debug

		switch(msgtype){
			case 'token':
						conn.send(JSON.stringify({type: "token", im: "spectator"}));
						break;


			case "statInit":

				window.colors = msg.colors;
				window.names = msg.names;
				window.catches = msg.catches;
				
				/*window.catches = new Array();
				for (var i = 0; i < window.names.length; i++) {
					window.catches.push(new Array());
					window.catches[i].push(0);
				};*/
				console.log(window.catches);

				window.pop = msg.pop;
				window.detpop = msg.detpop;
				/*window.detpop = [window.pop];*/
				renameLabels(1);
				break;

			case "catch":
				window.pop -= rcvdmessage;
				window.detpop.push(window.pop);

				var pos = window.colors.indexOf(ucolor)
				console.log(pos);
				window.catches[pos].push(parseInt(window.catches[pos][window.catches[pos].length - 1])+parseInt(rcvdmessage));
				if (window.drawing){
					if (window.groupy01){
						drawGraph(window.param1);
					}
					if (window.groupy02){
						drawGraph(window.param2);
					}
					
				}
				break;

			case 'repop':
				window.pop = rcvdmessage;
				window.detpop.push(window.pop);
				break;

			case 'start':
				var msg = {type: 'statInit'};
				conn.send(JSON.stringify(msg));
				window.playing = true;
				// if (window.drawing){
				// 	if (window.groupy01){
				// 		drawGraph(window.param1);
				// 	}
				// 	if (window.groupy02){
				// 		drawGraph(window.param2);
				// 	}
					
				// }
				break;

			case 'join':
				//ask how many users are connected
				if (typeof(window.names) != undefined && window.playing == false && window.names.length < 6){
						location.reload(true);
					}
				// var msg = {type: 'howmany'};
				// conn.send(JSON.stringify(msg));
				break;

			case 'part':
					location.reload(true);
				break;
		}
	}

	conn.onclose = function(e){
		console.log("Socket connection ended.");
		console.log(e);
	}

	getParameters = function(group){
		params = {};

		if (group == 1){
			window.groupy01 = true;
			if($('#stats01').is(":checked")){
				//players 01
				params.chartType = "players01";
				params.players = [];

				for (var i = 0; i < names.length; i++) {
					if ($('input[type=checkbox]').eq(i).is(":checked")){
						//checked parameters
						params.players.push(true);
					}
					else{
						//unchecked parameters
						params.players.push(false);
					}
				}
			}	
			else if($('#stats02').is(":checked")){
				//other stats 01
				if ($("input[value=pop]").filter(".group02").is(":checked")){
					//population
					params.chartType = "population";
					params.population = 1;
				}
				else if ($("input[value=catches]").filter(".group02").is(":checked")){
					//catch distribution
					params.chartType = "distribution";
					params.catch_dist = 1;
				}
			}
		}
		else{
			window.groupy02 = true;
			if ($('#stats03').is(":checked")){
				//players 02
				params.chartType = "players02";
				params.players = [];

				for (var i = 0; i < names.length; i++) {
					if ($("input[type=checkbox]").filter(".group03").eq(i).is(":checked")){
						//checked parameters
						params.players.push(true);
					}
					else{
						//unchecked parameters
						params.players.push(false);
					}
				}
			}
			else if($("#stats04").is(":checked")){
				//other stats 02
				if ($("input[value=pop]").filter(".group04").is(":checked")){
					//population 02
					params.chartType = "population";
					params.population = 2;
				}
				else{
					//catch distribution 02
					params.chartType = "distribution";
					params.catch_dist = 2;
				}
			}
		}
		return params;
	}
	
	checkEd01 = function(){
		if($('#stats01').is(":checked")){
			//enable group01 & disable group02
			$('.group02').attr("disabled", "true");
			$('.group02').css("color", "lightgray");
			$('.group02').prop("checked", false);


			$('.group01').removeAttr("disabled");
			$('label').filter('.group01').css("color", "black");
			$('.group01').css("text-decoration", "none");
			}
		else{
			//enable group02 & disable group01
			$('.group01').attr("disabled", "true");
			$('.group01').css("color", "lightgray");
			$('.group01').prop("checked", false);
			$('.group01').css("text-decoration", "line-through");

			$('.group02').removeAttr("disabled");
			$('.group02').css("color", "black");
		}
	}

	checkEd02 = function(){
		if($('#stats03').is(":checked")){
			//enable group03 & disable group04
			$('.group04').attr("disabled", "true");
			$('.group04').css("color", "lightgray");
			$('.group04').prop("checked", false);

			$('.group03').removeAttr("disabled");
			$('label').filter('.group03').css("color", "black");
			$('.group03').css("text-decoration", "none");
			}
		else{
			//enable group04 & disable group03
			$('.group03').attr("disabled", "true");
			$('.group03').css("color", "lightgray");
			$('.group03').prop("checked", false);
			$('.group03').css("text-decoration", "line-through");

			$('.group04').removeAttr("disabled");
			$('.group04').css("color", "black");
		}
	}

	renameLabels = function(group){
		for (var i = 0; i < window.names.length; i++) {
			if (group == 1) {
				$('span').eq(i).text(window.names[i]);
				$('span').eq(i).css("color", "#" + window.colors[i]);
			}
			else{
				switch(i){

				case 0:
					$("#p21").text(window.names[i]);
					$("#p21").css("color", "#" + window.colors[i]);
					break;

				case 1:
					$("#p22").text(window.names[i]);
					$("#p22").css("color", "#" + window.colors[i]);
					break;

				case 2:
					$("#p23").text(window.names[i]);
					$("#p23").css("color", "#" + window.colors[i]);
					break;

				case 3:
					$("#p24").text(window.names[i]);
					$("#p24").css("color", "#" + window.colors[i]);
					break;

				case 4:
					$("#p25").text(window.names[i]);
					$("#p25").css("color", "#" + window.colors[i]);
					break;
				}
			}
		}
	}

		drawGraph = function(parameters) {
			$.getScript("jquery.flot.js", function(){
			var type = parameters.chartType;
			var graphData = new Array();

			console.log(type);

			switch(type){
				case "players01":
				case "players02":

					var options = {
						series: {
							lines: {show: true}
						},
						xaxis: {
							show: true,
							ticks: 10,
							tickDecimals: 0,
							min: 0,
							max: 10,
							tickFormatter: function(val, ax){return ""}
						},
						yaxis: {
							show: true,
							ticks: 20,
							tickDecimals: 0,
							min: 0,
							max: 20,
							tickFormatter: function(val, ax){return ""}
						}
					};

					for (var i = 0; i < window.catches.length; i++) {
						if (parameters.players[i]){
							//create object with color and data
							var player = {
								label: window.names[i],
								color: "#" + window.colors[i], 
								data: new Array()
							};
							
							for (var j = 0; j < window.catches[i].length; j++) {
								player.data.push([j, window.catches[i][j]]);
							}
							//push object to graphData
							graphData.push(player);
						}
					}
				break;

				case "population":

					var options = {
						series: {
							lines: {show: true}
						},
						xaxis: {
							show: true,
							ticks: 50,
							tickDecimals: 0,
							min: 0,
							max: 50,
							tickFormatter: function(val, ax){return ""}
						},
						yaxis: {
							show: true,
							ticks: 20,
							tickDecimals: 0,
							min: 0,
							max: 20,
							tickFormatter: function(val, ax){return ""}
						}
					};

					var popular = {
						label: "Population",
						color: "red",
						data: new Array()
					};

					for (var i = 0; i < window.detpop.length; i++) {
						popular.data.push([i, window.detpop[i]]);
					};
					graphData.push(popular);
				break;
			}

			if (type == "players01" || parameters.population == 1 || parameters.catch_dist == 1){
				//div01
				placeholder = $("#graph01");
			}
			else if(type == "players02" || parameters.population == 2 || parameters.catch_dist == 2){
				//div02
				placeholder = $("#graph02");
			}

			placeholder.css({"width" : "960px", "height": "350px"});
			$.plot(placeholder, graphData, options);
		});
	}

	$('#another').click(function(){
	
		$('#another').css("visibility", "hidden");
		$('#graph02').css("visibility", "visible");
		$('#stats03').click(checkEd02);
		$('#stats04').click(checkEd02);
		$('#go02').click(function(){
			window.drawing = true;
			window.param2 = getParameters(2);
			console.log(window.param2);
		});

		$('#del').click(function(){
			$('#graph02').css("visibility", "hidden");
			$('#another').css("visibility", "visible");
		});

		renameLabels(2);
		checkEd02();
			$('#go02').click(function(){
			window.param2 = getParameters(2);
			drawGraph(window.param2);
		});
	});

	$('#stats01').click(checkEd01);
	$('#stats02').click(checkEd01);
	$('#go01').click(function(){
			window.drawing = true;
			window.param1 = getParameters(1);
			drawGraph(window.param1);
		});
	checkEd01();
});