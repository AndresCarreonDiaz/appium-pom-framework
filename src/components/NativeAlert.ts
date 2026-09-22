/**
 * The OS alert dialog. Android and iOS render it with different native
 * widgets, so this is one of the few places with platform-specific selectors.
 */
const SELECTORS = {
  android: {
    title: '//*[@resource-id="com.wdiodemoapp:id/alert_title"]',
    message: '//*[@resource-id="android:id/message"]',
    button: (label: string) => `//android.widget.Button[@text="${label.toUpperCase()}"]`,
  },
  ios: {
    alert: '-ios predicate string:type == "XCUIElementTypeAlert"',
    texts: '-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeStaticText',
    button: (label: string) => `~${label}`,
  },
}

class NativeAlert {
  private get container() {
    return $(driver.isAndroid ? SELECTORS.android.title : SELECTORS.ios.alert)
  }

  async waitForDisplayed(): Promise<void> {
    await this.container.waitForExist()
  }

  async waitForClosed(): Promise<void> {
    await this.container.waitForExist({ reverse: true })
  }

  /** Title and message joined by a newline, the same shape on both platforms. */
  async text(): Promise<string> {
    if (driver.isAndroid) {
      const title = await $(SELECTORS.android.title).getText()
      const message = await $(SELECTORS.android.message).getText()
      return `${title}\n${message}`
    }
    const labels = await $$(SELECTORS.ios.texts).map((text) => text.getText())
    return labels.join('\n')
  }

  /**
   * Negative check: watches for an alert during a fixed window. Proving that
   * something did NOT happen always needs an observation window.
   */
  async appearsWithin(ms: number): Promise<boolean> {
    try {
      await this.container.waitForExist({ timeout: ms })
      return true
    } catch {
      return false
    }
  }

  async tap(label: string): Promise<void> {
    const selector = driver.isAndroid ? SELECTORS.android.button(label) : SELECTORS.ios.button(label)
    await $(selector).click()
    await this.waitForClosed()
  }
}

export default new NativeAlert()
