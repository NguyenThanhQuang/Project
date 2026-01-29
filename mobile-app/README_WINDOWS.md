Mobile App - Windows Setup Guide (Expo + React Native)

This guide helps you run the mobile app on Windows using Expo (Android Emulator or physical device).

1) Prerequisites

- Git: https://git-scm.com/download/win
- Node LTS (>= 18): https://nodejs.org/en/download
- Yarn (optional): npm i -g yarn
- Android Studio: https://developer.android.com/studio
  - Install SDK Platform for Android 13+ (API 33/34)
  - Install Android Virtual Device (AVD) e.g. Pixel 5 API 33
- Environment variables (System Properties → Environment Variables):
  - ANDROID_HOME: C:\\Users\\<YourUser>\\AppData\\Local\\Android\\Sdk
  - JAVA_HOME: C:\\Program Files\\Android\\Android Studio\\jbr (or your JDK path)
  - Add to PATH: %ANDROID_HOME%\\platform-tools and %ANDROID_HOME%\\emulator
- Verify: adb --version, node -v, npm -v

2) Install Expo CLI

```
npm i -g expo
```

3) Install dependencies

```
cd Web/mobile-app
npm install
```

4) Configure network (Offline-first supported)

- Android Emulator mapping: use http://10.0.2.2:<port> instead of http://localhost:<port>
- Physical device: use your PC LAN IP (e.g., http://192.168.x.x:3000)
- Update base URLs if needed:
  - src/services/common/networkService.ts (candidate API URLs)
  - app.json (extra.API_URL optional)
- Allow ports in Windows Firewall: Metro (8081), Expo (19000/19001/19002)

5) Run the app

```
expo start
```

- Press a to launch Android emulator
- Or scan QR in Expo Go (Android) on same network
- If stuck: expo start -c

6) Common commands

- Install: npm install
- Start: expo start
- Start (clear cache): expo start -c
- Open emulator: press a in Expo terminal
- Open debugger: press d in Expo terminal

7) Troubleshooting

- Metro/Expo not loading: kill node processes, expo start -c, check ports
- Emulator cannot reach backend: use 10.0.2.2, ensure backend binds 0.0.0.0
- Physical device cannot reach backend: use LAN IP (ipconfig), same Wi‑Fi
- Java/Gradle errors: set JAVA_HOME to Android Studio jbr or JDK 17+
- Red screens: clear cache, delete .expo and node_modules then reinstall

8) Offline Mode

- App supports offline demo:
  - Trip search falls back to mock data
  - Trip details + seats generated when API offline
  - Admin trips use mock data when API down
  - Booking hold returns mock booking when offline

9) Optional AVD tips

- Create AVD in Android Studio → Device Manager
- Enable hardware acceleration (HAXM/Hyper‑V)

10) Scripts (package.json)

```
{
  "scripts": {
    "start": "expo start",
    "start:clear": "expo start -c",
    "android": "expo run:android",
    "lint": "eslint ."
  }
}
```

If Windows-specific issues persist, share the console logs so we can adjust firewall, SDK path, or IP list.


