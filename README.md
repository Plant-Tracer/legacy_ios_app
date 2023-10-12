# Plant Tracer app

To develop Plant Tracer app:

first clone the repo and checkout the appropriate branch

## Initialize the local build enviroment

We're not storing the node_modules, plugin, or platforms folders in Git/GitHub at this point, so we have to initialize them:

```
make init
```

## Build

```
make build
```

## Run on emulator

```
cordova emulate ios
```

## Run in XCode
```
open -a XCode platforms/ios
```
## Run browser
```
cordova serve
```

## Clean Up 
Remove the platforms so that the project is in a clean state
Then delete the node_modules, plugin, and platforms folders

You don't need to do a make clean before commits, but do a make clean before doing a make init.

```
make clean
```

## Notes

At the current time, the PlantTracer project has no plans to release a new version of Plant Tracer iOS app -- the work here in this branch is just exploratory.

Currently, this update-cordova branch is a work in progress. The main branch version is from 2017 and based on a very old version of Cordova (7.1). This branch is an attempt to get the app running of Cordova "latest" which at the moment is cordova-cli 12.0.0 and cordova-lib 12.0.1. 

The cordova-plugin-background-upload is currently removed due to dependency conflicts but maybe it is needed? There's a lot of dependency conflict issues trying to update various plugins.

Also note that for cordova-ios@7.0.1 -- the latest as of this date, the target iOS deployment version is 11, but XCode 15 won't happily accept anything less than 12. This doesn't seem to stop the generated app from running even on iOS 17, but produces warnings and sometimes errors in the ios build. I've submitted [cordova-ios Issue #1379](https://github.com/apache/cordova-ios/issues/1379) but in the meantime have added:
```
   <preference name="deployment-target" value="12.0" />
```
to config.xml as a workaround.

This branch takes the perhaps naive position that the platforms, plugins, and node_modules folders are not source code, but rather build artifacts. This is different from the approach taken currently in main. It is unknown whether the previous dev team made by-hand changes in the platforms, plugins, or node_modules folders. One hopes not, but given the version clashes in dependencies, one wonders whether things were hacked to accommodate. Once things all work, it might be an idea to specify specific versions of everything, preferably when creating a release rather than in source code, but not sure that's actually possible.

ToDo: consider updating everything in www/js
ToDo: resolve deprecations and other warnings
ToDo: keep working through the issues in the status below until the whole app runs
ToDo: clean up plugin semver specs -- ^ vs > vs ~. Haven't thought hard about those
ToDo: Tests!
ToDo: specify supported iOS range
ToDo: specify supported iOS devices
ToDo: specify supported browsers
ToDo: test on all simulators
ToDo: test on a range of real devices
ToDo: support the iPad
ToDo: support android, specifying versions and devices

### Platform build/run status As of today (Oct 12, 2023) 

- ios build completes successfully. The ios app runs in a simulator but only shows a black screen. There is a https://code.angularjs.org/1.6.9/docs/error/$compile/tpload error on the XCode console.

- android build fails with Dex errors, probably due to android library version conflicts in various dependencies? So we're not doing android at the moment. 

- browser build works a little better -- we get to the point of marking an apex, and then there is an error that initial_mask is not defined, even though initial_mask does get initialized in PlantTracer.js's init() method -- something about reloading?

