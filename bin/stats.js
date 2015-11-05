$(document).ready(function(){

	var IP = '10.12.129.75';
	var port = '8080';
	var ws = 'ws://' + IP + ':' + port
	console.log(ws);
	var conn = new WebSocket(ws);

	conn.onopen = function(e){
		console.log("Connected.")
	}

	conn.onmessage = function(e){
		var msg = JSON.parse(e.data);
		var msgtype = msg.type;
		var rcvdmessage = msg.message;
		var uname = msg.name;
		var ucolor = msg.color;

		console.log(msg); //debug
	}

	conn.onclose = function(e){
		console.log("Socket connection ended.");
	}
	
	checkEd01 = function(){
		if($('#stats01').is(":checked")){
			//enable group01 & disable group02
			$('.group02').attr("disabled", "true");
			$('.group02').css("color", "lightgray");
			$('.group02').prop("checked", false);

			$('.group01').removeAttr("disabled");
			$('.group01').css("color", "black");
			}
		else{
			//enable group02 & disable group01
			$('.group01').attr("disabled", "true");
			$('.group01').css("color", "lightgray");
			$('.group01').prop("checked", false);

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
			$('.group03').css("color", "black");
			}
		else{
			//enable group04 & disable group03
			$('.group03').attr("disabled", "true");
			$('.group03').css("color", "lightgray");
			$('.group03').prop("checked", false);

			$('.group04').removeAttr("disabled");
			$('.group04').css("color", "black");
		}
	}


	$('#another').click(function(){$('.container').append('<section id="graph02" class="row graph-group"><h3>Graph Group 2</h3><div class="collapsible"><input id="stats03" checked="checked" class="ml" type="radio" name="statgroup02" value="stats03"> Players<div class="cb pt"></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 1" value="1"> Dynamically Generated Player Name</label></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 2" value="2"> Dynamically Generated Player Name</label></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 3" value="3"> Dynamically Generated Player Name</label></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 4" value="4"> Dynamically Generated Player Name</label></div><div class="col-xs-12 col-sm-6"><label class="group03"><input class="group03" type="checkbox" name="player 5" value="5"> Dynamically Generated Player Name</label></div><div class="cb pt"></div><input id="stats04" class="ml" type="radio" name="statgroup02" value="stats04"> Other Stats<div class="cb pt"></div><div class="col-xs-12 col-sm-6"><label class="group04"><input class="group04" type="radio" name="charts" value="pop"> Population</label></div><div class="col-xs-12 col-sm-6"><label class="group04"><input class="group04" type="radio" name="charts" value="catches"> Catch Distribution</label></div><button type="button" class="btn btn-success fr mar">Go!</button><button id="del" type="button" class="btn btn-danger fr mar">Delete</button></div><div class="cb pt"></div></section>');

	
		$('#another').css("visibility", "hidden");
		$('#stats03').click(checkEd02);
		$('#stats04').click(checkEd02);
		$('#del').click(function(){
			$('#graph02').remove();
			$('#another').css("visibility", "visible");
		});
		checkEd02();
	});

	$('#stats01').click(checkEd01);
	$('#stats02').click(checkEd01);
	checkEd01();
});