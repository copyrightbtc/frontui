![Cryptocurrency Exchange Platform - SforTrade](https://github.com/sfortrade/meta/raw/main/images/sforfront.png)

<h3 align="center">  
<a href="https://www.sfor.trade/">Consulting</a> <span>&vert;</span>  
</h3> 

---
 
## License

Please note, that SforFront license only allows Non-Commercial use of this component. To purchase the Commercial license, please contact us at hello@sfor.trade.

## Install dependencies

```bash
$ yarn install
```

## Run in developement mode

```bash
$ yarn start-mock
``` 

## Execute tests

In `<rootDir>`

```bash
$ yarn test
```

Check test coverage:
```bash
$ yarn test -- --coverage --watchAll
```

For more options for `jest` run `yarn test --help`.

## Configuration documentation

Configuration file is fetched from sonic in  `public/config.js`


| Argument                 | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `api`    | URLs of `authsfor`, `tradesfor`, `applogic` and `ranger` API endpoints. You can use mockserver (<https://github.com/sfortrade/mockserver>) with default values |
| `minutesUntilAutoLogout`                |  Autologout time in minutes  |
| `withCredentials`               |  `false` or `true` if you want to include cookies as part of the request(https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)   |
| `gaTrackerKey` |  Google Analytics tracker key  |
| `rangerReconnectPeriod` |  Reconnection time for the Ranger WS service in minutes    |
| `msAlertDisplayTime` |  Alert message display duration in milliseconds    |
| `kycSteps` |  List of label names for KYC process    |

## Available Docker build args

While building a Docker image you can pass build-dependant arguments using `--build-arg`: 
`docker build -t sforfront:latest
  --build-arg BUILD_DOMAIN="example.com" .`

| Argument       | Description                                            |
| -------------- | ------------------------------------------------------ |
| `BUILD_EXPIRE` | Unix Timestamp of the build expiration date in seconds |
| `BUILD_DOMAIN` | Domain which you'd like to use during the deployment   |

## Build mobile app
Install dependencies using npm. Important for mobile app development.
```bash
npm install
```
Build frontend
```bash
yarn build
```
Generate a native project (ios, android)
```bash
ionic capacitor add <platform>
```
To build a native app you should have Xcode or Android studio on your local machine.
 
**2. Set up a development team**

All iOS apps must be code signed, even for development. Luckily, Xcode makes this easy with automatic code signing. The only prerequisite is an Apple ID.

Open Xcode and navigate to **Xcode » Preferences » Accounts**. Add an Apple ID if none are listed. Once logged in, a Personal Team will appear in the team list of the Apple ID.

**3. Create an iOS Simulator**

You can test your mobile application with a connected Iphone device to the Mac or using IOS Simulator.
Open Xcode and navigate to **Window » Devices and Simulators**. Create an **iPhone 11** simulator if one does not already exist.

**4. Set configs**

Open the `capacitor.config.json` file and modify the `appId` property.

Put the name of BE server:
```json
  "server": {
    "hostname": "example.sfortrade.work"
  }
```
 

## Build Android app
**1. Install Android studio**

Android Studio is IDE, that provides the fastest tools for building apps on every type of Android device.

**2. Open the `capacitor.config.json` file and modify the `linuxAndroidStudioPath` property.**

Run next command
```bash
whereis android-studio
```

**3. Build your android application**

```bash
ionic capacitor add android
```

**4. Launch android application with Android Studio**
```bash
ionic capacitor run android
```

**5. Android Studio configuration**

Select connected android device or configure device simulator, which required

**6. Update app with the changes**
```bash
ionic capacitor copy android [options]
```

**7. Set ANDROID_SDK_ROOT variale**

Set android ask path to ANDROID_SDK_ROOT or write sdk.dir variable in android/local.properties file (it doesn't exist as a default)

**8. Build android app**

Build android app using Android Studio Build tab

or you can build apk file with command line

Debug build:

```bash
  ionic capacitor copy android && cd android && ./gradlew assembleDebug && cd ..
```

Release build:

For release build you have to create keystore path and keystore alias and run next command:

```bash
  cd android &&
  ./gradlew assembleRelease &&
  cd app/build/outputs/apk/release &&
  jarsigner -keystore YOUR_KEYSTORE_PATH -storepass YOUR_KEYSTORE_PASS app-release-unsigned.apk YOUR_KEYSTORE_ALIAS &&
  zipalign 4 app-release-unsigned.apk app-release.apk
```
 