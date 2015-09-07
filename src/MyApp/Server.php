<?php

/*!
@mainpage Fishgame
@author Xavier Sánchez Díaz <sax@itesm.mx>
@version 0.1a
@date April, 2015
@bug Colors and Names may not be unique.
@bug Turns are not reassigned if a payer disconnects
*/

/*!
@class MyApp::Server
This is the main Server application. It includes many chat methods
such as part/join events, command-handling functions and message broadcasting.
It also includes the game itself.
@brief Server application, including various message-handling methods
*/

namespace MyApp;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

/*!
Maximum number of connections per room/application.
*/

define("MAXCLIENTS" , 3);

/*!
Maximum fish population per game.
*/

define("MAXPOP", 15);

/*!
Maximum rounds per game.
*/

define("MAXROUNDS", 10);

/*!
Fish regeneration ratio.
*/

define("REGEN", 0.25);

class Server implements MessageComponentInterface {
	
	protected $clients;/*!<	A SplObjectStorage that holds connection objects (sockets). */
	protected $listeners; /*!< Helper variable to storage number of listening clients when the game is running */
	protected $pop;
	protected $max_rounds = 0;
	protected $current_round = 0;
	protected $survival = true;
	protected $names = ["Dasyatis", "Pterois", "Xiphias", "Carassius", "Betta", "Poecilia", "Makaira", "Thunnus", "Carcharodon", "Octopus", "Arothron", "Pygoplites", "Ictalurus", "Callinectes", "Panulirus", "Palaemon", "Pleioptygma", "Crassostrea", "Loligo", "Melanocetus", "Sepiella", "Nautilus", "Chrysaora", "Squilla"];
	protected $colors = ['007AFF','FF7000','15E25F','CFC700','CF1100','CF00BE','F00'];
	protected $used_colors = [];

	public function __construct() {
		$this->clients = new \SplObjectStorage;
	}

	public function onOpen(ConnectionInterface $conn) {
		/*!
		Triggers when a client connects to the server.
		For each @p $conn, assigns a name via @ref assignName and then broadcasts a @ref tellJoin "join" event.

		@param ConnectionInterface $conn
		The socket that just connected to the server
		*/

		echo "Incoming connection: ({$conn->resourceId})\n";

		if (count($this->clients) < MAXCLIENTS) {
			$this->clients->attach($conn);
			echo "Connection successfully established. Resource ID: ({$conn->resourceId})\n";
			$this->assignName($conn);
			$this->tellJoin($conn);

			$conn->is_ready = false; // Is the client ready to play?
			$conn->is_listening = false; //Is the client playing?
			$conn->my_turn = false; // Is it their turn now?
			$conn->my_moves = 0; // how many times have I moved idk why
			$conn->tech = 0; // Preferred fishing technique. (0-3)
			$conn->my_catch = array(); // This array contains the score of this client
		}

		else{
			echo "Room is full. Closing connection.\n";
			$jason = ["type" => "system", "message" => "Lo siento, la sala está llena. ¡Adiós!", "name" => "System", "color" => "999999"];

			$conn->send(json_encode($jason));
			$this->onClose($conn);
		}
	}

	public function broadcast($msg){
		/*!
		Sends @p $msg to all connected clients.

		@param string	$msg
		A JSON string to send to all connected clients.
		*/
		foreach ($this->clients as $client) {
				$client->send($msg);
			}
	}


	public function onMessage(ConnectionInterface $from, $msg) {
		/*!
		Triggers everytime a message is received by the application.
		Depending on @p $msg type, the application will broadcast @p $msg accordingly.

		@param ConnectionInterface $from 
		This is the socket (client) who sent @p $msg.
		@param string $msg
		A JSON string sent by the client.
		*/

		$usermsg = json_decode($msg, true);

		//Prevent HTML tags from being sent to other clients

		if (isset($usermsg["message"])) {
			$forbidden = ['/</u', '/>/u'];
			$escapes = ['&lt;', '&gt;'];
			$nohtml = preg_replace($forbidden, $escapes, $usermsg["message"]);
		}

		$numRecv = count($this->clients) -1;

		switch ($usermsg["type"]) {

			default:
				echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n", $from->resourceId, $nohtml, $numRecv, $numRecv == 1 ? '' : 's');
				$jason = ["type" => "text","name" => $from->uname, "color" => $from->ucolor, "message" => $nohtml];
				$msg = json_encode($jason);
				$this->broadcast($msg);
				break;

			case "ready":
				$msg = $this->setReady($from);
				$this->broadcast($msg);

				if($this->checkReady()){
					$this->play();
				}
				break;

			case "action":
				echo sprintf('Connection %d sending action "%s" to %d other connection%s' . "\n", $from->resourceId, $nohtml, $numRecv, $numRecv == 1 ? '' : 's');
				$jason = ["type" => "action","name" => $from->uname, "color" => $from->ucolor, "message" => $nohtml];
				$msg = json_encode($jason);
				$this->broadcast($msg);
				break;

			case "listen":
				$this->listeners = 0;
				if ($from->is_listening == false) {
					$from->is_listening = true;
				}

				foreach ($this->clients as $client) {
					if ($client->is_listening) {
						$this->listeners += 1;
					}
				}

				echo sprintf("Connection %d is now listening\n", $from->resourceId);
				echo sprintf("%d listeners so far\n", $this->listeners);
				$this->assignTurn();
				break;

			case "end":
				$from->my_turn = false;
				$from->my_moves += 1;
				$from->my_catch = array_merge($from->my_catch, array($nohtml)); //What the actual fuck
				echo sprintf("Player %d has finished their turn \n", $from->resourceId);
				echo "Their catch so far is as follows:\n";
				print_r($from->my_catch);
				echo "-----------------\n";

				$this->pop = $this->pop - intval($nohtml);

				$jason = ["type" => "catch", "name" => $from->uname, "color" => $from->ucolor, "message" => $nohtml];
				$msg = json_encode($jason);
				$this->broadcast($msg);

				if ($this->pop == 0) {
					//end the game
					$this->endGame();
				}
				else{
					$roundy = array();

					foreach ($this->clients as $client) {
						$roundy[] = $client->my_moves;
					}

					if (array_sum($roundy) % MAXCLIENTS == 0) {
						//round is complete
						$this->endRound();
					}
					else{
						$this->assignTurn();
					}
				}
				break;

		}

	}


	public function onClose(ConnectionInterface $conn) {
		/*!
		Triggers when the connection is closed.
		Detaches @p $conn from @ref $clients and broadcasts a @ref tellPart "part" event.

		@param ConnectionInterface $conn
		This is the socket (client) who is leaving the application.
		*/
		echo "Connection {$conn->resourceId} has disconnected\n";
		if (isset($conn->is_listening)){
			if ($conn->is_listening){
				$this->listeners = $this->listeners - 1;
			}
		}
		if (isset($conn->ucolor)) {
			$this->colors[] = $conn->ucolor;
		}
		$conn->close();

		$this->clients->detach($conn);
		$this->tellPart($conn);
	}


	public function assignName(ConnectionInterface $conn) {
		/*!
		Assigns a pseudo-random, human-readable name and color to @p $conn
		and then notify them about it.

		@param ConnectionInterface $conn
		This is the socket (client) being named and colored.
		*/
		
		$conn->uname = $this->names[mt_rand(0, count($this->names)-1)]; // Random name of the player.
		$colored = $this->colors[mt_rand(0, count($this->colors)-1)]; // Random color of the player.
		unset($this->colors[array_search($colored, $this->colors)]);
		$this->colors = array_values($this->colors);
		$conn->ucolor = $colored;
		$this->used_colors[] = $colored;

		$jason = ["type" => "handshake","name" => $conn->uname, "color" => $conn->ucolor, "message" => $conn->resourceId];

		$usermsg = json_encode($jason);
		$conn->send($usermsg);
	}

	public function assignTurn(){
		/*!
		Assigns turn to who is next.
		*/
		if ($this->listeners == MAXCLIENTS) {

			foreach ($this->clients as $client) {
				$client->my_turn = false; //set everybody's turn as false
			}

			$id_of_next = $this->guessTurn(); //connectionId of who's next
			echo "-----------------\n";
			echo sprintf("Player " . $id_of_next . " is now playing \n");

			foreach ($this->clients as $client) {
				//echo "I'm at client number " . $client->resourceId . "\n";
				if ($id_of_next == $client->resourceId) {
					//echo "This player should move now!\n";
					$client->my_turn = true;

					$jason = ["type" => "turn","name" => $client->uname, "color" => $client->ucolor, "message" => $client->resourceId];
					$msg = json_encode($jason);
					break;
				}
			}
			$this->broadcast($msg);
		}

	}

	public function guessTurn(){
		/*!
		Determines who's next in a round.
		@retval int $resourceId
		The connection ID whose turn is ahead.
		*/
		$players = array();
		foreach ($this->clients as $client) {
			//check how many times a client has played
			$players[$client->resourceId] = $client->my_moves;
		}

		$whos_next = current(array_keys($players, min($players)));

		return $whos_next;

	}

	public function tellJoin(ConnectionInterface $conn){
		/*!
		Broadcasts a @p join event when @p $conn connects to the application.

		@param ConnectionInterface $conn
		This is the socket (client) joining the room.
		*/

		$jason = ["type" => "join","name" => $conn->uname, "color" => $conn->ucolor];
		$msg = json_encode($jason);

		$this->broadcast($msg);
	}


	public function tellPart(ConnectionInterface $conn){
		/*!
		Broadcasts a @p part event when @p $conn disconnects from the application.

		@param ConnectionInterface $conn
		This is the socket (client) joining the room.
		*/

		if (isset($conn->uname)) {
			$jason = ["type" => "part","name" => $conn->uname, "color" => $conn->ucolor];
			$msg = json_encode($jason);

			$this->broadcast($msg);
		}
	}

	public function setReady(ConnectionInterface $conn){
		/*!
		Toggles ready status for a client.
		@param ConnectionInterface 
		$conn This is the socket (client) that will be marked as ready.
		@retval string $readymsg
		A JSON string to tell clients the readiness status of @p $conn.
		*/

		if ($conn->is_ready){
			$conn->is_ready = false;
			echo "Connection {$conn->resourceId} is now marked as unready\n";
			$jason = ["type" => "unready","name" => $conn->uname, "color" => $conn->ucolor];
			$readymsg = json_encode($jason);
		}
		else{
			$conn->is_ready = true;
			echo "Connection {$conn->resourceId} is now marked as ready\n";
			$jason = ["type" => "ready","name" => $conn->uname, "color" => $conn->ucolor];
			$readymsg = json_encode($jason);
		}

		return $readymsg;
	}

	public function checkReady(){
		/*!
		Checks if all connected clients are ready.
		
		@retval bool	$all_ready
		Readiness status of all clients.
		*/

		$rdy_users = array();
		$all_ready = false;

		foreach ($this->clients as $client) {
			if ($client->is_ready) {
				array_push($rdy_users, $client->is_ready);
			}
		}

		if (count($rdy_users) == MAXCLIENTS) {
			$all_ready = true;
		}

		return $all_ready;
	}

	public function onError(ConnectionInterface $conn, \Exception $e) {
		/*!
		Override with exception handling and such.
		*/
	}

	public function resetValues(){
		/*!
		Reset values for each player.
		Useful if you need to restart the game with
		the same clients connected.
		*/
		foreach ($this->clients as $client) {
			$client->is_ready = false;
			$client->is_listening = false;
			$client->my_turn = false;
			$client->my_moves = 0;
			unset($client->my_catch);
			$client->my_catch = array();
		}
	}

	public function endRound(){
		/*!
		Ends the round.
		Adds regeneration and notify everybody.
		It also assigns new turn if necessary.
		*/
		$this->current_round += 1;

		if (!$this->survival) {
			//check rounds
			if ($this->current_round > MAXROUNDS) {
				$this->endGame();
				return;
			}
		}

		$this->pop = floor($this->pop * (1 + REGEN));
		echo sprintf("Round %d has begun.\nPopulation so far: %d \n", $this->current_round, $this->pop);

		$jason = ["type" => "system", "message" => "A new round has begun!", "name" => "System", "color" => "999999"];
		$msg = json_encode($jason);
		$this->broadcast($msg);

		$jason = ["type" => "repop", "message" => $this->pop];
		$msg = json_encode($jason);
		$this->broadcast($msg);
		$this->assignTurn();

	}

	public function endGame(){
		/*!
		Ends the game.
		Notify everyone the results.
		*/
		$catches = array();
		$names = array();
		foreach ($this->clients as $client) {
			// if(isset($client->my_catch)){
			// 	var_dump($client->my_catch);
			// }

			if (sizeof($client->my_catch) != 0) {
				$catches[] = $client->my_catch;	
			}
			else{
				$client->my_catch = array_merge($client->my_catch, array("0"));
				$catches[] = $client->my_catch;	
			}
			$names[] = $client->uname;
			$colors[] = $client->ucolor;
		}

		$this->resetValues();

		$jason = ["type" => "over", "catches" => $catches, "names" => $names, "colors" => $colors];
		$msg = json_encode($jason);
		$this->broadcast($msg);

		echo "The game has finished.\n";
	}

	public function play(){
		/*!
		Starts the game about fish.
		*/
		echo "The game has started.\n";
		$jason = ["type" => "system", "message" => "Starting game", "name" => "System", "color" => "999999"];
		$msg = json_encode($jason);
		$this->broadcast($msg);
		$this->current_round = 1;
		$this->pop = MAXPOP;

		$jason = ["type" => "start", "message" => $this->pop];
		$msg = json_encode($jason);
		$this->broadcast($msg);

		//while there are enough fish
		//asign turn to player, other clients block ui
		//listen for end of turn
		//get catch for player, calculate stuff
		//broadcast new stuff to players
		//end of loop
	}
}
?>