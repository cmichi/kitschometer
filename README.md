# kitschometer

This is the code behind an interactive installation wich was created for
the exhibition [Kunst oder
Kitsch?](http://www.kloster-schussenried.de/kloster/klostermuseum/wie-huebsch-how-nice-che-bello/).
The exhibition runs from 13. April until 22. June 2014 in the city Bad
Schussenried in the southern part of Germany.

This repository is meant as a documentation of the installation.
See [this](http://) blog post for further details on the project.

**Status:** It works, but the code is heavily cluttered and needs to be
sanitized and refactored.

[![Kitschometer](https://github.com/cmichi/kitschometer/raw/master/photo.jpg)](http://micha.elmueller.net/2014/04/kitschometer/)


## Setup documentation

The installation consits of two pc's: 
 * `exposition_frontend`: an ArchLinux machine displaying a frontend
 * `exposition_raspberry`: a RaspberryPi which reads from two external
   hardware buttons as input devices.


### exposition_fronted

The machine has be configured to use the Slim login manager and dwm as a
window manger. Logging in automatically has been configured as well.

The `.xinitrc` looks like this:

	setterm -blank 0 -powersave off -powerdown 0
	xset s off

	cp /home/sundata/kitschometer/exposition_frontend/redirect.html /tmp/
	(cd /home/sundata/kitschometer/exposition_frontend/ && forever start kitschometer.js)


	(uzbl-browser file:///tmp/redirect.html) & 
	sleep 1
	/home/sundata/unclutter/unclutter &
	exec dwm

dwm has been compiled with these adaptions in config.h, in order to hide
the colorful borders of program windows and stuff:

	static const char normfgcolor[]     = "#000000";
	static const char selbordercolor[]  = "#000000";
	static const char selbgcolor[]      = "#000000";


### exposition_raspberry

The standard raspberry image has been enhanced with a startup daemon
`/etc/init.d/kitschometer`:

	### BEGIN INIT INFO
	# Provides:             kitschometer
	# Required-Start:
	# Required-Stop:
	# Default-Start:        2 3 4 5
	# Default-Stop:         0 1 6
	# Short-Description:    kitschometer hardware reading
	### END INIT INFO

	export PATH=$PATH:/opt/node/bin
	export NODE_PATH=$NODE_PATH:/opt/node/lib/node_modules
	export HOME=/home/pi

	case "$1" in
	  start)
	    /opt/node/bin/forever start /home/pi/kitschometer/exposition_raspberry/chatServer.js
	    ;;
	  stop)
	    exec /opt/node/bin/forever stopall
	    ;;
	  *)

	  echo "Usage: /etc/init.d/nodeup {start|stop}"
	  exit 1
	  ;;
	esac
	exit 0

Be sure to have executed

	sudo chmod +x /etc/init.d/kitschometer
	sudo update-rc.d kitschometer defaults

This daemon provides a simple TCP server `chatServer.js` on port 1337. The
input from the external hardware buttons is streamed there as ints: 0, 64
or 128.
The `exposition_fronted` stuff connects there and reads the input.


## Acknowledgment

The project takes use of those awesome icons:

 * Venus by MaxineVSG from The Noun Project 
 * Gnome by Bonnie Beach from The Noun Project
 * Explosion by Jerry Wang from The Noun Project


# License

This code is licensed under the MIT license:

	Copyright (c) 2014

		Michael Mueller <http://micha.elmueller.net/>
		Leo Hnatek 

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
