export type Tab = 'Home' | 'Webview' | 'Login' | 'Forms' | 'Swipe' | 'Drag'

/** Bottom navigation, present on every screen of the app. */
class TabBar {
  async waitForDisplayed(): Promise<void> {
    // First launch includes app install and driver startup, so allow extra time.
    await $('~Home').waitForDisplayed({ timeout: 120_000 })
  }

  async open(tab: Tab): Promise<void> {
    await $(`~${tab}`).click()
  }
}

export default new TabBar()
