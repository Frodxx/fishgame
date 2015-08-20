Client Life
===============

## Player Life

### What happens when a client connects to the server if there's still slots available?

1. Client connects to the server and a @p $conn object is created on the Server.
2. Client is attached to [$clients].
3. A resourceId is generated for the Client (@p $conn->resourceId)
4. Client is then named and colored via [assignName]
5. Server tells connected players a new Client joined via [tellJoin]
6. A group of game-specific variables are set for the new Client:
	- $conn->is_ready = false
	- $conn->is_listening = false
	- $conn->my_turn = false
	-	$conn->my_moves = 0
	-	$conn->tech = 0
	-	$conn->catch = array()
7. Client waits for the game to start.
8. Client plays, duh.

### What happens when a client connects to the server if there's no slots available?

1. Client is notified no slots are available.
2. Server closes the connection via [onClose];

[clients]: @ref MyApp::Server::$clients
[assignName]: @ref MyApp::Server::assignName
[tellJoin]: @ref MyApp::Server::tellJoin
[onClose]: @ref MyApp::Server:onClose