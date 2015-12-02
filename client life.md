Client Life
===============

## Player Life

### What happens when a player connects to the server if there are slots available?

1. Player connects to the server and a `$conn` object is created on the Server.
2. Once confirmed the client is a player, it is then attached to `$players`.
3. Player is then named and colored via `assignName` method.
4. Server tells connected players a new player joined via `tellJoin` method.
5. A group of game-specific variables are set for the new player:
	- `$conn->is_ready = false`
	- `$conn->is_listening = false`
	- `$conn->my_turn = false`
	-	`$conn->my_moves = 0`
	-	`$conn->catch = array()`
6. Player mark itself as ready.
7. When all players are marked as ready, the game starts.

### What happens when a player connects to the server if there's no slots available?

1. Player is notified no slots are available.
2. Server closes the connection via `onClose`.

### What happens when a player disconnects from the server before starting the game?

1. Player disconnects from the server, and the `$conn`object is detached from `$players`.
2. Server tells everyone a player left the room via `tellPart` method.

### What happens when a player disconnects from the server during the game?

1. Player disconnects from the server, and the `$conn`object is detached from `$players`.
2. Server tells everyone a player left the room via `tellPart` method.
3. The game is interrupted, and every other player automatically refreshes. A new name and color will be assigned to each player upon refreshing.

## Spectator Life

### What happens when a spectator connects to the server?

1. Spectator connects to the server and a `$conn` object is created on the Server.
2. Once confirmed the client is a spectator, it is then attached to `$spectators`.
3. Spectator asks the Server for current information.
4. Server replies with current information.
5. Spectator receives current information, and starts listening for any changes.


##Special Cases

###What happens when a player connects if spectators are already watching?

Every time a player connects to the server, an already-listening spectator will auto-refresh in order to receive the latest information of the game.

###What happens when a player disconnects if spectators are already watching?

Same as above, spectator will auto-refresh to receive the latest information of the game. It doesn't matter if the disconnect event occurs before or mid-game, the spectator will refresh anyway.

###What happens when a spectator disconnects from the server before starting the game?

Spectator disconnects from the server, but the `$conn` object **is not detached** from `$spectators`. This is not implemented yet, but should be.

###What happens when a spectator disconnects from the server during the game?

Same as above. There's no difference between disconnecting before or mid-game.