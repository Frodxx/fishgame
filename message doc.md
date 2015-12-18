Message structures and types
==============


##What is a message?

All data sent between clients and server (direction doesn't matter) is a **message**.
Each message is transferred as a [JSON] string, which is then converted into a human-readable format on each client.

All actions are reflected in each host as special messages. Each message has a different structure. Available structures will vary depending if the message is sent server-side or client-side, and will be described below.


##Message Structure
Messages *usually* contain the following JSON structure:

- **type**: The type of message. Used to trigger different functions on the server.
- **name**: The readable name assigned for a user. Used on client-side operations.
- **color**: The color (hex value) assigned for a user. Used on client-side operations.
- **message**: The content of the message. Usually it contains the text from a client input. Used for chat mainly client-side.


##Message Type

The "type" name is checked by clients and the server in order to operate. There are 18 different "type" values. There is a method associated with each client->server value, they share the same name except when specified:

###Server-side "types"
- **action**: triggers action messages, such as */me goes to the Beach* in chat.
	- Used in the `text` method.
- **end**: used to tell the server a client has finished their turn. Only used in client->server direction.
	- Used in the `finish` method.
- **listen**: triggers UI blocking on clients when the game starts. Only used in client->server direction.
- **ready**: sets clients' ready status as true.
	- Used in `ready` and `setReady` methods.
- **statInit**: used to retrieve current information of the game to inform spectators.
- **system**: system messages that are generally sent to one client, like notices or announcements. Only used in server->client direction.
	- Used in `onOpen` and `play` methods.
- **text**: the standard type of message, when a client sends text in chat.
- **token**: checks type of connection (Player or Spectator).
- **unready**: sets clients' ready status as false.
	- Used in `setReady` method.

###Client-side "types"

- **catch**: used to tell players a specific client has caught some fish. Only used in server->client direction.
	-Used in `finish` method.
- **handshake**: used to assign name and color to a client on new connection. Only used in server->client direction.
	- Used in `assignName` method.
- **join**: triggers join notices on clients. Only used in server->client direction.
	- Used in `tellJoin` method.
- **over**: triggers the end of the game. Only used in server->client direction.
	- Used in `endGame` method.
- **part**: triggers part notices on clients. Only used in server->client direction.
	- Used in `tellPart` method.
- **ready**: sets clients' ready status as true.
	- Used in `ready` and `setReady` methods.
- **repop**: used at the end of a round to regenerate population. Only used in server->client direction.
	- Used in `endRound` method.
- **start**: starts the game on each client. Only used in server->client direction.
	- Used in `play` method.
- **statInit**: used to retrieve current information of the game to inform spectators.
- **text**: the standard type of message, when a client sends text in chat.
- **token**: checks type of connection (Player or Spectator).
- **turn**: triggers UI unblocking on clients when it's their turn. Only used in server->client direction.
	- Used in `assignTurn` method.
- **unready**: sets clients' ready status as false.
	- Used in `setReady` method.
- **users**: retrieves players on the room.
	- Used in `whoIsOnline` method.


##Message Name

The message "name" contains the server-assigned name (as a string) for a given user. Names are randomly selected from a pre-defined list which contains multiple geni from animals inhabiting the sea.

Possible names are the following:

*Dasyatis, Pterois, Xiphias, Carassius, Betta, Poecilia, Makaira, Thunnus, Carcharodon, Octopus, Arothron, Pygoplites, Ictalurus, Callinectes, Panulirus, Palaemon, Pleioptygma, Crassostrea, Loligo, Melanocetus, Sepiella, Nautilus, Chrysaora and Squilla*.


##Message Color

The message "color" name contains the server-assigned color in hex value (as a string). Colors are randomly selected from a pre-defined list which contains multiple hex values.

Possible colors (hex values) are the following:

007AFF, FF7000, 15E25F, CFC700, CF1100, CF00BE, B25C71.


##Message content ("message")

The "message" name is used to store plain text to be delivered to chat. This includes both client and server messages. Common uses of the "message" name are:
- Chat text like *Octopus: Hey buddy, I think you've got the wrong door....*
- Chat actions like *Nick goes to the beach.*
- Server messages like *Room is full!* or *Game starting...*.

Although HTML tags are allowed in the client's input, the server will always send HTML as plain text, so `<bold>aa</bold>` will look exactly as is.

##Special Cases

There are some special cases in which the message structure is different:

###Special Structures

- **im**: used in client->server direction to set the connection type. Values can be either `player` or `spectator`.
- **catches**: used in server->client direction to notify clients the detailed (cumulative) catch of each player.
	- Used in `statInit` method.
	- Used in `endGame` method though this info is no longer used by the clients.
- **colors**: used in server->client direction to notify clients the colors of the connected players.
	- Used in `statIinit` method.
	-	Used in `whoIsOnline` method.
	- Used in `endGame` method.
- **detpop**: used in server->client direction to notify spectators the cumulative population.
	- Used in `statInit` method.
- **names**: used in server->client direction to notify clients the names of the connected players.
	- Used in `statInit` method.
	-	Used in `whoIsOnline` method.
	- Used in `endGame` method.
- **pop**: used in server->client direction to notify spectators the actual population.
	- Used in `statInit` method.

###Special Types
- **howmany**: **UNUSED** - used in client->server (specifically spectators->server) to ask how many players are connected.

[json]: http://json.org/