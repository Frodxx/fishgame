$(document).ready(function(){

	var IP = '10.12.129.75';
	var port = '8080';
	var ws = 'ws://' + IP + ':' + port
	console.log(ws);
	var conn = new WebSocket(ws);

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

			case "statInit":

				window.colors = msg.colors;
				window.names = msg.names;
				
				window.catches = new Array();
				for (var i = 0; i < window.names.length; i++) {
					window.catches.push(new Array());
					window.catches[i].push(0);
				};
				console.log(window.catches);

				window.pop = msg.pop;
				window.detpop = [window.pop];
				renameLabels(1);
				break;

			case "catch":
				window.pop -= rcvdmessage;
				window.detpop.push(window.pop);

				var pos = window.colors.indexOf(ucolor)
				window.catches[pos].push(parseInt(window.catches[pos][window.catches[pos].length - 1])+parseInt(rcvdmessage));
				break;

			case 'repop':
				window.pop = rcvdmessage;
				window.detpop.push(window.pop);
				break;

			case 'start':
				window.pop = rcvdmessage;
				window.detpop = [];
				window.detpop.push(window.pop);
				window.catches = [];
				for (var i = 0; i < window.names.length; i++) {
					window.catches.push(new Array());
					window.catches[i].push(0);
				}
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
			if($('#stats01').is(":checked")){
				//players 01
				params.chartType = "players";
				params.players01 = [];

				for (var i = 0; i < names.length; i++) {
					if ($('input[type=checkbox]').eq(i).is(":checked")){
						//checked parameters
						params.players01.push(true);
					}
					else{
						//unchecked parameters
						params.players01.push(false);
					}
				}
			}	
			else{
				//other stats 01
				if ($('input[type=radio]').eq(2).is(":checked")){
					//population
					params.chartType = "population";
					params.population = 1;
				}
				else{
					//catch distribution
					params.chartType = "distribution";
					params.catch_dist = 1;
				}
			}
		}
		else{
			if ($('#stats03').is(":checked")){
				//players 02
				params.chartType = "players";
				params.players02 = [];

				for (var i = 0; i < names.length; i++) {
					if ($('input[type=checkbox]').eq(i + 5).is(":checked")){
						//checked parameters
						params.players02.push(true);
					}
					else{
						//unchecked parameters
						params.players02.push(false);
					}
				}
			}
			else{
				//other stats 02
				if ($('input[type=radio]').eq(6).is(":checked")){
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

	drawGraph = function(parameters, type, placeholder) {
		
		switch(type){
			case "players":

				var options = {
					series: {
						lines: {show: true}
					},
					xaxis: {
						show: true,
						ticks: 20,
						tickDecimals: 0,
						min: 0,
						max: 20,
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
					window.catches[i] //pending
				};
			break;
		}

		$.plot(placeholder, data, options);
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
				$('span').eq(i+names.length).text(window.names[i]);
				$('span').eq(i+names.length).css("color", "#" + window.colors[i]);
			}
			}
	}

	$('#another').click(function(){$('.container').append('<section id="graph02" class="row graph-group"><h3>Graph Group 2</h3><div class="collapsible"><input id="stats03" checked="checked" class="ml" type="radio" name="statgroup02" value="stats03"> Players<div class="cb pt"></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 1" value="1"> <span>Dynamically Generated Player Name</span></label></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 2" value="2"> <span>Dynamically Generated Player Name</span></label></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 3" value="3"> <span>Dynamically Generated Player Name</span></label></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 4" value="4"> <span>Dynamically Generated Player Name</span></label></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 5" value="5"> <span>Dynamically Generated Player Name</span></label></div><div class="cb pt"></div><input id="stats04" class="ml" type="radio" name="statgroup02" value="stats04"> Other Stats<div class="cb pt"></div><div class="col-xs-12 col-sm-6"><label class="group04"><input class="group04" type="radio" name="charts" value="pop"> Population</label></div><div class="col-xs-12 col-sm-6"><label class="group04"><input class="group04" type="radio" name="charts" value="catches"> Catch Distribution</label></div><button type="button" id="go02" class="btn btn-success fr mar">Go!</button><button id="del" type="button" class="btn btn-danger fr mar">Delete</button></div><div class="cb pt"></div></section>');

	
		$('#another').css("visibility", "hidden");
		$('#stats03').click(checkEd02);
		$('#stats04').click(checkEd02);
		$('#go02').click(function(){
			window.param2 = getParameters(2);
			console.log(window.param2);
		});
		$('#del').click(function(){
			$('#graph02').remove();
			$('#another').css("visibility", "visible");
		});
		renameLabels(2);
		checkEd02();		
	});

	$('#stats01').click(checkEd01);
	$('#stats02').click(checkEd01);
	$('#go01').click(function(){
			window.param1 = getParameters(1);
			console.log(window.param1);
		});
	checkEd01();
});