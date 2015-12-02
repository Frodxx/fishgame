Connection Object Structure
==============

When a client connects to the server, a `$conn` object is created. This object (simply called *connection*) is then attached to `$players` or `$spectators`depending on the page it's connecting from. The Player `$conn` contains many variables used to handle the game itself. Most of these variables are inherent from the game, but there are other variables used as helpers for the game process. The connection structure is explained below.

##Connection Structure

A `$conn` object has the following variables if connecting from a playing-client:

###Player handling variables
- `$is_listening` - listening status (bool) of the connection. A listening connection is a player currently ingame. Initialized as *false*.
	- This variable is set in `onMessage` method.
- `$is_ready` - readiness status (as bool) of the connection. Initialized as *false*.
	- This variable is set in `setReady` method.
- `$my_moves` - number of times this connection has played.
	- This variable is set in `onMessage` method.
- `$my_turn` - status (as bool) of the connection's turn. *Is it my turn?*
	- This variable is set in `onMessage` method.
- `resourceId` - ID of the client, assigned automatically upon connection.
- `$uname` - the server-assigned name (as a string) for the connection.
	- This variable is set in `assignName` method.
- `$ucolor` - the server-assigned color in hex value (as a string) for the connection.
	- This variable is set in `assignName` method.

###Game specific variables

- `my_catch` - an array containing the overall catch for this connection. Initialized with *0* as a first element.
	- This variable is set in [onMessage] method.