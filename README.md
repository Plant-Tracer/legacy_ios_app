# Plant Tracer app

## Build

```
cordova prepare
cordova build ios
cordova build android
```

## Run on emulator

```
cordova emulate ios
cordova emulate android
```

## Notes

At the current time, the PlantTracer project has no plans to release a new version of Plant Tracer iOS app -- the work here in this branch is just exploratory.

Currently, this update-cordova branch is a work in progress. The main branch version is from 2017 and based on a very old version of Cordova (7.1). This branch is an attempt to get the app running of Cordova "latest" which at the moment is 12.0.0. As of today (Oct 9, 2023) the ios build completes successfully. The ios app runs in a simulator but only shows a black screen. The android build fails with Dex errors, probably due to android library version conflicts in various dependencies? Running a browser build works a little better -- the initial screens are shown, but "Upload video" does nothing and we are stuck.

The cordova-plugin-background-upload is currently removed due to dependency conflicts but maybe it is needed? There's a lot of dependency conflict issues trying to update various plugins.

Also note that for cordova-ios@7.0.1 -- the latest as of this date, the target iOS is 11, but XCode 15 won't accept anything less than 12. This doesn't seem to stop the generated app from running even on iOS 17, but produces warning in the ios build. So probably should downgrade XCode to 14.3 or else wait for someone to update cordova-ios.

This branch takes the perhaps naive position that the platforms, plugins, and node_modules folders are not source code, but rather build artifacts. This is different from the approach taken currently in main. It is unknown whether the previous dev team made by-hand changes in the platforms, plugins, or node_modules folders. One hopes not, but given the version clashes in dependencies, one wonders whether things were hacked to accommodate.

At some point working on this branch, a number of plugin definitions disappeared from config.xml. Not sure why or how, and some of them may need to be restored and updated. But at the moment, with the build not working in android with even fewer plugins, the issue is not yet ripe for resolution.

