# The Fish Game

This is a digital rendition about The Fish Game, developed and published by The Cloud Institute for Sustainability Education.

The Fish Game is a game that allows participants to become inspired and hopeful about contributing to the shift toward a sustainable future through education, generate a personal rationale for educating for sustainability and develop a shared understanding and vocabulary of Sustainability and Education for Sustainability.

## Table of Contents

- [Installation Overview](#installation)
- [First Time Setup Overview](#first-time-setup)
- [Playing](#playing)
- [License](#license)

## Installation ##

The Fish Game requires an AMP environment in which the server will run. Depending on your operating system, directions for getting an AMP stack up and running may vary.

- If you're using Mac OS-X, then check out **[MAMP](https://www.mamp.info)**.
- If you're using Windows, then **[WAMP](http://www.wampserver.com/en/)** is the usual choice. MAMP also comes in Windows version.

- If you're using Linux, then your distro probably includes all required components, but you'll have to adjust some settings. Look for directions in the web, as different Linux distributions use different folders and commands.

The Fish Game also requires the following dependencies:

- **[Composer](https://getcomposer.org)** (needed for the Ratchet installation)
- **[Ratchet](http://socketo.me)**
- **[Flot](http://www.flotcharts.org)**
- **[Hopscotch](http://linkedin.github.io/hopscotch/)**

You can find detailed installation directions below.

### 1. Getting the Fish Game source ###

1. Clone this repository or download via zip.
2. Unzip contents inside the `www` folder in your **AMP** server. So you should end up with, let's say *wamp\www\fishgame* if using WAMP.
3. Open a terminal (command line) and navigate to **The Fish Game** directory.

### 2. Installing and setting-up Composer ###

1. Check the **[Installation guide](https://getcomposer.org/doc/00-intro.md)** and install depending on your Operating System.
2. In **The Fish Game** folder, create a `JSON` file and name it `composer.json`.
3. Edit `composer.json` and add the following content:

	```json
	{
	 "autoload": {
	   "psr-0": {
	     "MyApp": "src"
	   }
	 },
	 "require": {
	  "cboden/ratchet": "0.3.*"
	 }
	}
	```
4. Save all changes.

### 3. Installing Ratchet ###

1. Go to your terminal (command line) and make sure you're in **The Fish Game** folder.
2. Install **[Ratchet](http://socketo.me/)** with `composer install` command.

### 4. Installing Flot ###

1. Download **[Flot](http://www.flotcharts.org/)** in zip format.
2. Unzip contents. Be sure to remember where you unzipped **Flot**.
3. Copy `jquery.flot.js` from the **Flot** unzipped contents.
4. Navigate to **The Fish Game** directory, and then to the *bin* folder.
5. Paste `jquery.flot.js` you copied earlier.

### 5. Installing Hopscotch ###

1. Download the latest **[Hopscotch](https://github.com/linkedin/hopscotch/releases)** via zip.
2. Unzip contents. Be sure to remember where you unzipped **Hopscotch**.

#### 5.1 CSS ####

1. Navigate to *dist* folder, and then to *css* folder.
2. Copy the `hopscotch.css` file.
3. Navigate to *The Fish Game* directory, and then to the *bin* folder.
4. Paste `hopscotch.css` you copied earlier.

#### 5.2 JS ####

1. Navigate to *dist* folder, and then to *js* folder.
2. Copy the `hopscotch.js` file.
3. Navigate to *The Fish Game* directory, and then to the *bin* folder.
4. Paste `hopscotch.js` you copied earlier.

#### 5.3 Images ####
1. Navigate to *dist* folder, and then to *img* folder.
2. Copy **both** `sprite-green` and `sprite-orange` files.
3. Navigate to *The Fish Game* directory, and then to the *img* folder.
4. Paste **both** `sprite-green` and `sprite-orange` you copied earlier.

That should install all the required components.

## First time setup ##

Before running the game, you'll need to adjust some settings, both on client and server.

### Server first-time setup ###

1. Open a terminal (command line) and navigate to **The Fish Game** folder.
2. Go to the *bin* folder and open the `chat-server.php` file with a text editor.
3. Go to line **8**, and change the `$myIP` variable. It should contain the IP address of your server as a string, so make sure it is wrapped around quotation marks ('my.ip.is.this' or "my.ip.is.this").
4. Save changes and exit the editor.

### Client first-time setup ###

1. Open a terminal (command line) and navigate to **The Fish Game** folder.
2. Go to the *bin* folder and open the `scripty.js` file with a text editor.
3. Go to line **4**, and change the `IP` variable. It should contain the IP address of your server as a string, so make sure it is wrapped around quotation marks ('my.ip.is.this') or ("my.ip.is.this").
4. Save changes and exit the editor.

## Playing ##

When you're ready to play, just turn on the server and open the client on your browser.

### Turning on the server ###

1. Open a terminal (command line) and navigate to **The Fish Game** folder.
2. Move to the *bin* folder, and turn on the server with the command `php chat-server.php`.

The server should be up and running now.

### Accesing the game as a client ###

1. Open your browser and navigate to the following URL: `localhost\fishgame\bin\room.html`

That's all :)

### Adjusting game settings ###

1. Open a terminal (command line) and navigate to **The Fish Game** folder.
2. Go to the *src* folder and open the `preferences.ini` file with a text editor.
3. Adjust the settings as you like. When you're done, save changes and exit the editor.

## License ##

The Fish Game (c) 1995-2015 The Cloud Institute for Sustainability Education.

This digital rendition of The Fish Game is licensed under a MIT License.
Read [LICENSE](LICENSE) for more information.