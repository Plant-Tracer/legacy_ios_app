init:
	cordova platform add browser
	cordova platform add ios

build:
	cordova build browser
	cordova build ios

clean:
	cordova clean
	cordova platform rm ios browser
	rm -rf node_modules plugins platform