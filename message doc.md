Message structures and types
==============


##What is a message?

All data sent between clients and server (direction doesn't matter) is a **message**.
Each message is transferred as a [JSON] string, which is then converted into a human-readable format on each client.

All actions are reflected in each host as special messages. Each message has a different structure. Available structures will vary depending if server-side or client-side, and will be described below.


##Message Structure
Messages contain the following JSON structure:

- **type**: The type of message. Used to trigger different functions on the server.
- **name**: The readable name assigned for a user. Used on client-side operations.
- **color**: The color (hex value) assigned for a user. Used on client-side operations.
- **message**: The text from a client input. Used for chat mainly client-side.


##Message Types

The "type" name is checked by clients and the server in order to operate. There are X different "type" values.

- **action**: triggers action messages, such as "/me goes to the Beach" in chat.
	- Used in [onMessage] method.
- **end**: used to tell the server a client has finished their turn. This message type is only used in client->server direction.
- **handshake**: used to assign name and color to a client on new connection.
	- Used in [assignName] method.
- **join**: triggers join notices on clients.
	- Used in [tellJoin] method.
- **listen**: triggers UI blocking on clients when the game starts. This message type is only used in client->server direction.
	- Used in [onMessage] method.
- **part**: triggers part notices on clients.
	- Used in [tellPart] method.
- **ready**: sets clients' ready status as true.
	- Used in [setReady] method.
- **start**: starts the game on each client.
	- Used in [play] method.
- **system**: system messages that are generally sent to one client, like notices or announcements.
	- Used in [onOpen] and [play] methods.
- **text**: the standard type of message, when a client sends text in chat.
	- Used in [onMessage] method.
- **turn**: triggers UI unblocking on clients when it's their turn. This message type is only used in server->client direction.
	- Used in [onMessage] method.
- **unready**: sets clients' ready status as false.
	- Used in [setReady] method.


##Message Name

The message "name" contains the server-assigned name (as a string) for a given user. Names are randomly selected from a pre-defined list which contains multiple geni from animals inhabitating the sea.

Possible names are the following:

*Dasyatis, Pterois, Xiphias, Carassius, Betta, Poecilia, Makaira, Thunnus, Carcharodon, Octopus, Arothron, Pygoplites, Ictalurus, Callinectes, Panulirus, Palaemon, Pleioptygma, Crassostrea, Loligo, Melanocetus, Sepiella, Nautilus, Chrysaora and Squilla*.


##Message Color

The message "color" name contains the server-assigned color in hex value (as a string). Colors are randomly selected from a pre-defined list which contains multiple hex values.

Possible colors (hex values) are the following:

007AFF,FF7000,FF7000,15E25F,CFC700,CFC700,CF1100,CF00BE and F00.


##Message content ("message")

The "message" name is used to store plain text to be deilvered to chat. This includes both client and server messages. Common uses of the "message" name are:
- Chat text like *Octopus: Hey buddy, I think you've got the wrong door....*
- Chat actions like *Nick goes to the beach.*
- Server messages like *Room is full!* or *Game starting...*.

Although HTML tags are allowed in the client's input, the server will always send HTML as plain text, so `<bold>aa</bold>` will look exactly as is.

[json]: http://json.org/
[onopen]: @ref MyApp::Server::onOpen
[play]: @ref MyApp::Server::play
[onmessage]: @ref MyApp::Server::onMessage
[assignName]: @ref MyApp::Server::assignName
[tellJoin]: @ref MyApp::Server::tellJoin
[tellPart]: @ref MyApp::Server::tellPart
[setReady]: @ref MyApp::Server::setReady