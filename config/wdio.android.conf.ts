import { join } from 'node:path'
import { config as shared } from './wdio.shared.conf.ts'

export const config: WebdriverIO.Config = {
  ...shared,
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'Android Emulator',
      'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION ?? '14',
      'appium:app': join(process.cwd(), 'apps', 'android.apk'),
      'appium:appWaitActivity': 'com.wdiodemoapp.MainActivity',
      'appium:newCommandTimeout': 240,
      'appium:uiautomator2ServerInstallTimeout': 120_000,
      'appium:adbExecTimeout': 120_000,
    },
  ],
}
