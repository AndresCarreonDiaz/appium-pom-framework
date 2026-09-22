import type { ChainablePromiseElement } from 'webdriverio'

type PlatformSelectors = { android: string; ios: string }

/**
 * Shared behaviour for every screen: how to find elements, how to wait
 * for the screen to be ready, and the gestures the screens need.
 */
export default abstract class BasePage {
  /** Accessibility id of the element that proves this screen is shown. */
  protected abstract readonly screenId: string

  /** Element by accessibility id: `content-desc` on Android, `name` on iOS. */
  protected byId(id: string): ChainablePromiseElement {
    return $(`~${id}`)
  }

  /** Element by a platform-specific selector, for the few cases ids can't cover. */
  protected byPlatform(selectors: PlatformSelectors): ChainablePromiseElement {
    return $(driver.isAndroid ? selectors.android : selectors.ios)
  }

  get screen(): ChainablePromiseElement {
    return this.byId(this.screenId)
  }

  async waitForDisplayed(): Promise<void> {
    await this.screen.waitForDisplayed()
  }

  async isDisplayed(): Promise<boolean> {
    return this.screen.isDisplayed()
  }

  /** Taps an empty part of the screen so the keyboard stops covering the form. */
  protected async hideKeyboard(): Promise<void> {
    if (await driver.isKeyboardShown()) {
      await this.screen.click()
    }
  }

  protected async swipe(direction: 'left' | 'right' | 'up' | 'down', within: ChainablePromiseElement): Promise<void> {
    await driver.swipe({ direction, scrollableElement: await within, percent: 0.8 })
  }
}
