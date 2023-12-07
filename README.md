- Install the outdated libraries with the command "--legacy-peer-deps"
- For react-native-beacons-manager, use the following settings:
  - android {
    compileSdkVersion 33
    buildToolsVersion "31.0.0"

    defaultConfig {
    minSdkVersion 21
    targetSdkVersion 33
    versionCode 1
    versionName "1.0"
    }
    }
- Of course replace "compile" with "implementation"
- And import "android.support.annotation.Nullable;" with "androidx.annotation.NonNull;"