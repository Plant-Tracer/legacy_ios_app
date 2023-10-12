/*--------------------D.R.E.A.M. 3.0-------------------------
	Designed and Developed by NYU CREATE (c) 2014 - 2018
-----------------------------------------------------------*/
app.factory('GLOBAL', ['$rootScope', '$http', function($rootScope, $http){
	var gsdb = false;
	var drdb = false;
    var q;
	return {
		removeTapDelay : function(){
        	var attachFastClick = Origami.fastclick;
            return attachFastClick(document.body);
        },
		checkConnection: function() {
			/* does not exist on all browsers, and seems to be unused in this app
            var networkState = navigator.connection.type;            
            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';
            return states[networkState];
			*/
			return 'Unknown connection';
        },
        techDetect: function(){
        	var devicePlatform 			= device.platform;
        	var tech = {};
        	tech["deviceType"] 			= devicePlatform;
        	tech["flash"] 				= Modernizr.flash;
        	tech["webGL"]				= Modernizr.webgl;
        	tech["html5Video"]			= Modernizr.video;
        	tech["html5Audio"]			= Modernizr.audio;
        	tech["webAudio"]			= Modernizr.webaudio;
        	tech["geolocation"]			= Modernizr.geolocation;
        	tech["history"]				= Modernizr.history;
        	tech["canvasText"] 			= Modernizr.canvastext;
        	tech["cookies"] 			= Modernizr.cookies;
        	tech["eventListeners"]		= Modernizr.eventlistener;
        	tech["forcetouch"]			= Modernizr.forcetouch;
        	tech["fullscreen"]			= Modernizr.fullscreen;
        	tech["batteryAPI"]			= Modernizr.batteryapi;
        	tech["JSON"]				= Modernizr.json;
        	tech["pageVisibility"]		= Modernizr.pagevisibility;
        	tech["pointerLock"]			= Modernizr.pointerlock;
        	tech["querySelector"]		= Modernizr.queryselector;
        	tech["touchEvents"]			= Modernizr.touchevents;
        	tech["getRandomValues"]		= Modernizr.getrandomvalues;
        	tech["flexboxTweener"]		= Modernizr.flexboxtweener;
        	tech["beacon"]				= Modernizr.beacon;
        	tech["localStorage"]		= Modernizr.localstorage;
        	tech["base64"]				= Modernizr.atobbtoa;
        	tech["sessionStorage"]		= Modernizr.sessionstorage;
        	tech["speechRecognition"]	= Modernizr.speechrecognition;
        	tech["lowBandwidth"]		= Modernizr.lowbandwidth;
        	tech["flexWrap"]			= Modernizr.flexwrap;
        	tech["flexbox"]				= Modernizr.flexbox;
        	tech["svg"]					= Modernizr.svg;
        	tech["dataview"]			= Modernizr.dataview;
        	tech["CORS"]				= Modernizr.cors;
        	tech["appCache"]			= Modernizr.applicationcache;
        	tech["internationalization"]= Modernizr.intl;
        	tech["vibrate"]				= Modernizr.vibrate;
        	tech["websockets"]			= Modernizr.websockets;
        	tech["lowbattery"]			= Modernizr.lowbattery;
        	tech["flexboxlegacy"]		= Modernizr.flexboxlegacy;
        	tech["fontface"]			= Modernizr.fontface;
        	tech["devicemotion"]		= Modernizr.devicemotion
        	tech["deviceorientation"]	= Modernizr.deviceorientation;
        	tech["filesystem"]			= Modernizr.filesystem;
        	tech["eventsource"]			= Modernizr.eventsource;
        	tech["websqldatabase"]		= Modernizr.websqldatabase;
        	tech["datachannel"]			= Modernizr.datachannel;
        	tech["websocketsbinary"]	= Modernizr.websocketsbinary;
        	Modernizr.on('indexeddb'	, 	function(result) { tech["indexedDB"] 		= result; });
        	Modernizr.on('audiopreload'	, 	function(result) { tech["audioPreload"] 	= result; });
        	Modernizr.on('webglextensions', function(result) { tech["webglextensions"] 	= result; });
        	return tech;
        },
        calculateAspectRatioFit : function(srcWidth, srcHeight, maxWidth, maxHeight) {
            var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
            return { width: srcWidth*ratio, height: srcHeight*ratio };
        }
	}
}]);