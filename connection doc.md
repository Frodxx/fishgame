Connection Object Structure
==============

When a client connects to the server, a @p $conn object is created. This object (simply called *connection*) contains many variables used to handle the game itself. Most of these variables are inherent from the game, but there are other variables used for the game process as well. The connection structure is explained below.

##Connection Structure

A @p $conn object has the following variables:

###Client handling variables
- **is_listening**: listening status (bool) of the connection. A listening connection is a player currently ingame. Initialized as *false*.
	- This variable is set in [onMessage] method.
- **is_ready**: readiness status (as bool) of the connection. Initialized as *false*.
	- This variable is set in [setReady] method.
- **my_moves**: number of times this connection has played.
	- This variable is set in [onOpen] method.
- **my_turn**: status (as bool) of the connection's turn. *Is it my turn?*
	- This variable is set in [onOpen] method.
- **uname**: the server-assigned name (as a string) for the connection.
	- This variable is set in [assignName] method.
- **ucolor**: the server-assigned color in hex value (as a string) for the connection.
	- This variable is set in [assignName] method.

###Game specific variables

- **tech**: the preferred fishing technique for this connection. Also determines how many fish will be caught in this turn. Initialized as @p 0.
	- This variable is set in [onOpen] method.
- **catch**: an array containing the overall catch for this connection.
	- This variable is set in [onOpen] method.

[assignName]: @ref MyApp::Server::assignName
[setReady]: @ref MyApp::Server::setReady
[onOpen]: @ref MyApp::Server::onOpen
[onMessage]: @ref MyApp::Server::onMessage