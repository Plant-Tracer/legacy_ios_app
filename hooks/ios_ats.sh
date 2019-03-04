#!/bin/bash

echo "Adjusting plist for App Transport Security exception."
val=$(/usr/libexec/plistbuddy -c "add NSAppTransportSecurity:NSExceptionDomains:planttracer.com:NSTemporaryExceptionAllowsInsecureHTTPLoads bool true" platforms/ios/HelloCordova/HelloCordova-Info.plist 2>/dev/null)
echo "Done"