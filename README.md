# app-britt-espresso 

<div id="readme" class="blob instapaper_body">
    <article class="markdown-body entry-content" itemprop="mainContentOfPage">
        <h1>Instalacion</h1>
        <p><pre>

<h4>Instalacion</h4>

NodeJs <a href="https://nodejs.org/">https://nodejs.org/</a>

PhoneGap <a href="http://phonegap.com/install/">http://phonegap.com/install/</a>

Apache Cordova <a href="http://cordova.apache.org/docs/en/5.0.0//guide_cli_index.md.html#The%20Command-">http://cordova.apache.org/docs/en/5.0.0//guide_cli_index.md.html#The%20Command-</a>

Android SDK <a href="http://developer.android.com/sdk/installing/index.html?pkg=tools
Line%20Interface
">http://developer.android.com/sdk/installing/index.html?pkg=tools
Line%20Interface
</a>

Java SDK <a href="http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html">http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html</a>

Git <a href="http://git-scm.com/download/win">http://git-scm.com/download/win</a>

	* <a href="</a>https://github.com/svado/app-britt-espresso">https://github.com/svado/app-britt-espresso</a>
	* u: svado@britt.com
	* p: Cafe2Britt1

Gulp <a href="http://gulpjs.com/">http://gulpjs.com/</a>

	* npm install -global gulp

Bower <a href="http://bower.io/">http://bower.io/</a>

	* npm install -g bower

PhoneGap Build <a href="https://forums.adobe.com/message/4549827">https://forums.adobe.com/message/4549827</a>

Ripple <a href="https://bradb.net/improving-the-quality-assurance-process/ ">https://bradb.net/improving-the-quality-assurance-process/ </a>

	* npm install -g ripple-emulator
	* C:\Users\YOUR_USERNAME\AppData\Roaming\npm\node_modules\ripple-emulator\lib\server\emulate --Open cordovaProject.js and replace all strings which contain "platforms" with an empty one ""
	* ripple emulate --path platforms/android/assets/www

Weinre (debugger): <a href="https://github.com/CGastrell/phonegap/wiki/Debugger-weinre ">https://github.com/CGastrell/phonegap/wiki/Debugger-weinre </a>

	* npm -g install weinre@2.0.0-pre-I0Z7U9OV
	* weinre --boundHost 192.168.18.228
	* http://192.168.18.228:8080--avg android


Genymotion <a href="https://www.genymotion.com">https://www.genymotion.com</a>

	* u: svado@britt.com
	* p: Cafe2Britt1

Emulator:  C:\Users\svado\AppData\Local\Android\android-sdk\ AVD Manager.exe 

NGCordova: <a href="http://ngcordova.com/docs/install/ ">http://ngcordova.com/docs/install/ </a>

    * bower install ngCordova
    * cordova plugin add https://github.com/litehelpers/Cordova-sqlite-storage.git

<h4>Referencias</h4>

Adobe PhoneGap <a href="https://build.phonegap.com/apps">https://build.phonegap.com/apps</a>

Cordova <a href="http://cordova.apache.org/docs/en/5.0.0//guide_cli_index.md.html#The%20Command-Line%20Interface">http://cordova.apache.org/docs/en/5.0.0//guide_cli_index.md.html#The%20Command-Line%20Interface</a>

About <a href="https://github.com/CGastrell/phonegap/wiki/Estructura-de-un-proyecto-Phonegap ">https://github.com/CGastrell/phonegap/wiki/Estructura-de-un-proyecto-Phonegap </a>

Phonegap Emulator <a href="http://www.raymondcamden.com/2013/11/05/Ripple-is-Reborn">http://www.raymondcamden.com/2013/11/05/Ripple-is-Reborn</a>

Plugins <a href="http://plugins.cordova.io/#/ ">http://plugins.cordova.io/#/ </a>

Github <a href="http://rogerdudler.github.io/git-guide/ ">http://rogerdudler.github.io/git-guide/ </a>

<h4>Errores de instalacion</h4>

#1 cordova minsdkversion cannot be smaller: <a href="http://stackoverflow.com/questions/27095077/how-do-i-use-toolsoverridelibrary-in-a-build-gradle-file ">http://stackoverflow.com/questions/27095077/how-do-i-use-toolsoverridelibrary-in-a-build-gradle-file </a>

<h4>Consola</h4>

Levantar el servidor phonegap: phonegap serve --> 192.168.18.228:3000
Levantar el servidor cordova: cordova serve --> localhost:8000 / 192.168.18.228:3000
Emular: cordova emulate android | ios
Ripple: ripple emulate android
Ionic lab: ionic serve --lab

Github:

	* git add *
	* git commit -m ""
	* git push origin master
    </pre></p>

    <h1>Ionic framework</h1>

    <p><pre>
<h4>Instalar</h4>

Ionic <a href="http://ionicframework.com/">http://ionicframework.com/</a>

Angular messages <a href="https://github.com/paullang/ionicNgMessagesExample">https://github.com/paullang/ionicNgMessagesExample </a>

	* npm install angular-messages 

<h4>Referencias</h4>

Ionic creator <a href="https://creator.ionic.io ">https://creator.ionic.io </a>

Ionic brackets <a href="http://www.ionicbrackets.com/ ">http://www.ionicbrackets.com/ </a>

Angular batarang <a href="https://chrome.google.com/webstore/detail/angularjs-batarang/ighdmehidhipcmcojjgiloacoafjmpfk?utm_source=chrome-ntp-icon ">https://chrome.google.com/webstore/detail/angularjs-batarang/ighdmehidhipcmcojjgiloacoafjmpfk?utm_source=chrome-ntp-icon </a>

<h4>Errores de instalacion</h4>

#1 gulp: cannot find module 'through2' <a href="http://www.saintsatplay.com/blog/2015/01/resolving-gulp-cannot-find-module-errors#.Vc4BAvlViko ">http://www.saintsatplay.com/blog/2015/01/resolving-gulp-cannot-find-module-errors#.Vc4BAvlViko </a>

    * npm install through2 --save-dev
	* npm install concat-with-sourcemaps --save-dev

#2 Angular-messages: ENOGIT Git is not installed or not in the PATH: 

    * <a href="http://stackoverflow.com/questions/20666989/bower-enogit-git-is-not-installed-or-not-in-the-path ">http://stackoverflow.com/questions/20666989/bower-enogit-git-is-not-installed-or-not-in-the-path </a>
    
<h4>Consola</h4>

Levantar servidor: ionic serve
Cambiar servidor: ionic address
    </pre></p>
    </article>
</div>