# Project Tracker

## Setup
- Install Nodejs (Version in .nvmrc file) in [page](https://nodejs.org/en/download/)
- Install Gem in [page](https://rubygems.org/pages/download)
- Install CocoaPods, which is used to manage Capacitor packages for iOS: 
```bash
sudo gem install cocoapods
```
- Run npm in Project: 
```bash
npm install
```
- Run app in Web: 
```bash
npm start
```
- To run app in simulators, please see the below building iOS/Android 

## Some Commands to use in this project
```bash
ionic cap sync
ionic cap add ios
ionic cap open ios
ionic cap run ios
ionic cap run ios -l --external
ionic cap add android
ionic cap open android
ionic cap run android
ionic cap run android -l --external
```

## Build iOS
Should run the below command once to build ios/android folders:
```bash
ionic cap sync
```

### Installing Xcode

### Indexing Project
- Open Xcode and index the Project.
- Once open Xcode, should navigate to Xcode » Preferences » Locations » Command Lines Tools » Xcode version.
- Should build and running App (Optional).

### Testing
- Run: 
```bash
ionic cap run ios -l --external
```

## Build Android (For MAC)
Should run the below command once to build ios/android folders:
```bash
ionic cap sync
``` 

### Installing Android Studio
- Download Android Studio from the [Android website](https://developer.android.com/studio/).

### Installing the Android SDK
- Once installed, open Android Studio.
- In the SDK Components Setup screen, select all of packages if not selected and finish installing the SDK.

### Creating an Android Virtual Device
- In Toolbar, select **Devices » Device Manager** or in the **Tools » Device Manager** menu
- Click Create Device. Should choose **Pixel 2 (XL) API 30**.

### Configuring Command Line Tools
- In ~/.bashrc, ~/.bash_profile, or ~/.zshrc, Add the Android SDK command-line directories to PATH: 
```bash
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
# avdmanager, sdkmanager
export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin
# adb, logcat
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
# emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
```
- Run the below command to apply this lines: 
```bash
source ~/.bashrc (~/.bash_profile or ~/.zshrc)
```

### Testing
- Run: 
```bash
ionic cap run android -l --external
```