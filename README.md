# app-britt-espresso 

<h1>Instalacion</h1>

<div>
Instalar

NodeJs https://nodejs.org/

PhoneGap http://phonegap.com/install/

Apache Cordova http://cordova.apache.org/docs/en/5.0.0//guide_cli_index.md.html#The%20Command-

Android SDK http://developer.android.com/sdk/installing/index.html?pkg=tools
Line%20Interface

Java SDK http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html

Git http://git-scm.com/download/win

	* https://github.com/svado/app-britt-espresso 
	* u: svado@britt.com
	* p: Cafe2Britt1

Gulp http://gulpjs.com/ 

	* npm install -global gulp

Bower http://bower.io/

	* npm install -g bower

PhoneGap Build https://forums.adobe.com/message/4549827

Ripple https://bradb.net/improving-the-quality-assurance-process/ 

	* npm install -g ripple-emulator
	* C:\Users\YOUR_USERNAME\AppData\Roaming\npm\node_modules\ripple-emulator\lib\server\emulate --Open cordovaProject.js and replace all strings which contain "platforms" with an empty one ""
	* ripple emulate --path platforms/android/assets/www

Weinre (debugger): https://github.com/CGastrell/phonegap/wiki/Debugger-weinre 

	* npm -g install weinre@2.0.0-pre-I0Z7U9OV
	* weinre --boundHost 192.168.18.228
	* http://192.168.18.228:8080--avg android


Genymotion https://www.genymotion.com

	* u: svado@britt.com
	* p: Cafe2Britt1


Emulator:  C:\Users\svado\AppData\Local\Android\android-sdk\ AVD Manager.exe 

Referencias

Adobe PhoneGap https://build.phonegap.com/apps

Cordova http://cordova.apache.org/docs/en/5.0.0//guide_cli_index.md.html#The%20Command-Line%20Interface

About https://github.com/CGastrell/phonegap/wiki/Estructura-de-un-proyecto-Phonegap 

Phonegap Emulator http://www.raymondcamden.com/2013/11/05/Ripple-is-Reborn

Plugins http://plugins.cordova.io/#/ 

Github http://rogerdudler.github.io/git-guide/ 

Errores de instalacion

#1 cordova minsdkversion cannot be smaller: http://stackoverflow.com/questions/27095077/how-do-i-use-toolsoverridelibrary-in-a-build-gradle-file 

Consola

Levantar el servidor phonegap: phonegap serve --> 192.168.18.228:3000
Levantar el servidor cordova: cordova serve --> localhost:8000 / 192.168.18.228:3000
Emular: cordova emulate android | ios
Ripple: ripple emulate android
Ionic lab: ionic serve --lab

Github:

	* git add *
	* git commit -m ""
	* git push origin master
</div>