#!/bin/bash

set -e
set -x

tns prepare ios --release
cd platforms/ios

xcodebuild -scheme mindstream -workspace mindstream.xcworkspace \
    -configuration Release clean archive \
    -archivePath "build/mindstream.xcarchive" \
    CODE_SIGN_IDENTITY="" \
    CODE_SIGNING_REQUIRED=NO \
    CODE_SIGNING_ALLOWED=NO
mkdir Payload
cp -R build/mindstream.xcarchive/Products/Applications/mindstream.app Payload/
zip -r build/mindstream.ipa Payload
rm -rf Payload
