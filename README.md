# Appium POM Framework

[![Mobile tests](https://github.com/AndresCarreonDiaz/appium-pom-framework/actions/workflows/tests.yml/badge.svg)](https://github.com/AndresCarreonDiaz/appium-pom-framework/actions/workflows/tests.yml)

Cross-platform mobile test automation for **Android and iOS** with **Appium**, **WebdriverIO** and **TypeScript**, built on the **Page Object Model**. The same test suite runs on an Android emulator and an iOS simulator in GitHub Actions on every push.

It targets the public [WebdriverIO native demo app](https://github.com/webdriverio/native-demo-app) (pinned to v2.2.0), so anyone can clone it and run it. This is a demo framework I built to show how I structure mobile automation. It is not code from any employer.

## What it covers

| Area | Tests |
| --- | --- |
| Navigation | Every tab opens its screen, including a hybrid WebView screen (checked through the WEBVIEW context) |
| Login and sign up | Successful login, invalid email, short password, successful sign up, mismatched passwords |
| Forms | Text input echo, switch on and off, dropdown picker, native alert closed with each of its 3 buttons, inactive button does nothing |
| Gestures | Carousel swipes forward and back, vertical scroll to a hidden element |
| Drag and drop | A dropped piece leaves the board, the full puzzle is solved and a new game starts |

## Project structure

```
.
├── config/
│   ├── wdio.shared.conf.ts     # runner, timeouts, reporters, screenshot on failure
│   ├── wdio.android.conf.ts    # UiAutomator2 capabilities
│   └── wdio.ios.conf.ts        # XCUITest capabilities
├── src/
│   ├── pages/                  # one page object per screen
│   │   ├── BasePage.ts         # selectors, waits, keyboard and swipe helpers
│   │   ├── LoginPage.ts
│   │   ├── FormsPage.ts
│   │   ├── SwipePage.ts
│   │   ├── DragPage.ts
│   │   ├── WebviewPage.ts
│   │   └── HomePage.ts
│   ├── components/             # UI shared across screens
│   │   ├── TabBar.ts
│   │   ├── NativeAlert.ts
│   │   └── Picker.ts
│   └── data/
│       └── users.ts            # test data
├── test/specs/                 # tests, written as user behaviour
├── scripts/download-apps.sh    # fetches the pinned app builds
└── .github/workflows/tests.yml # typecheck + lint, then Android and iOS jobs
```

## Design decisions

**Selectors live only in page objects.** Specs describe behaviour (`LoginPage.login(validUser)`, `DragPage.solvePuzzle()`) and never touch a selector. When the UI changes, one file changes.

**Accessibility ids first.** `~id` maps to `content-desc` on Android and `name` on iOS, so one selector works on both platforms. They are also the most stable choice: they don't depend on layout like XPath does, and they double as accessibility labels for real users.

**Platform differences are isolated.** Where the platforms genuinely differ (the native alert, the dropdown picker, carousel items on Android), the page object uses `byPlatform({ android, ios })`. Tests stay identical on both platforms.

**No sleeps.** Every wait is tied to a condition: an element appearing, a piece leaving the board, a WEBVIEW context existing. The one deliberate time window is `NativeAlert.appearsWithin()`, because proving that something did NOT happen always needs an observation window.

**Tests are isolated.** Each spec file gets a fresh app session, and tests whose screen keeps state (the drag and drop puzzle, the carousel) start from a freshly relaunched app.

**Evidence on failure.** Failed tests save a screenshot, and results are written as JUnit XML. CI uploads both as artifacts for each platform.

## Running locally

Requirements: Node 22, and either Android Studio with an emulator running, or Xcode with an iOS simulator.

```bash
npm ci
npm run apps            # downloads the pinned demo app builds into ./apps

npm run test:android    # Android emulator
npm run test:ios        # iOS simulator
```

Appium and its UiAutomator2 and XCUITest drivers are project dependencies, so there is no global install. The WebdriverIO Appium service starts and stops the server.

Pick a device with environment variables:

| Variable | Default |
| --- | --- |
| `ANDROID_DEVICE_NAME` | `Android Emulator` |
| `ANDROID_PLATFORM_VERSION` | `14` |
| `IOS_DEVICE_NAME` | `iPhone 17` |
| `IOS_PLATFORM_VERSION` | `26.5` |

Static checks: `npm run typecheck` and `npm run lint`.

## CI

`.github/workflows/tests.yml` runs typecheck and lint first, then two jobs in parallel:

- **Android:** API 34 emulator on `ubuntu-latest` with KVM acceleration, via `reactivecircus/android-emulator-runner`.
- **iOS:** iPhone simulator on `macos-15`, using the newest iOS runtime installed on the runner.

## Author

Andres Carreon, Senior SDET. [andresio.com](https://www.andresio.com) · [LinkedIn](https://www.linkedin.com/in/andrescarreon/)
