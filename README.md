# The Fish Game

This is a digital rendition about The Fish Game, developed and published by The Cloud Institute for Sustainability Education.

The Fish Game is a game that allows participants to become inspired and hopeful about contributing to the shift toward a sustainable future through education, generate a personal rationale for educating for sustainability and develop a shared understanding and vocabulary of Sustainability and Education for Sustainability.

As of now, this rendition presents the game as is on paper, but later on some modifications may appear.

## Table of Contents

- [Getting the Fish Game source](#1-getting-the-fish-game-source)
- [Installing and setting-up Composer](#2-installing-and-setting-up-composer)
- [Installing Ratchet](#3-installing-ratchet)
- [Installing Flot](#4-installing-flot)
- [License](#license)

## Installation and Setup ##

### Installation ###

#### 1. Getting the Fish Game source ####

1. Clone this repository or download via zip.
2. Unzip contents. Be sure to remember where you unzipped **The Fish Game**.
3. Open a terminal (command line) and navigate to **The Fish Game** directory.

#### 2. Installing and setting-up Composer ####

1. Check the [Installation guide](https://getcomposer.org/doc/00-intro.md) and install depending on your Operating System.
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

#### 3. Installing Ratchet ####

1. Go to your terminal (command line) and make sure you're in **The Fish Game** folder.
2. Install [Ratchet](http://socketo.me/) with `composer install` command.

#### 4. Installing Flot ####

1. Download [Flot](http://www.flotcharts.org/) via zip.
2. Unzip contents. Be sure to remember where you unzipped **Flot**.
3. Copy `jquery.flot.js` from the **Flot** unzipped contents.
4. Navigate to **The Fish Game** directory, and then to the **bin** folder.
5. Paste `jquery.flot.js` you copied earlier.

That should install all the required components.

## License ##

The Fish Game (c) 1995-2015 The Cloud Institute for Sustainability Education.

This digital rendition of The Fish Game is licensed under a MIT License.
Read [LICENSE](LICENSE) for more information.