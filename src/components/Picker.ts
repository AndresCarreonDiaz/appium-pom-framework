/**
 * The native dropdown picker: a list on Android, a picker wheel on iOS.
 */
const SELECTORS = {
  android: {
    list: '//android.widget.ListView',
    option: (value: string) => `//android.widget.ListView/*[@text="${value}"]`,
  },
  ios: {
    wheel: '-ios predicate string:type == "XCUIElementTypePickerWheel"',
    done: '~done_button',
  },
}

class Picker {
  private get container() {
    return $(driver.isAndroid ? SELECTORS.android.list : SELECTORS.ios.wheel)
  }

  async select(value: string): Promise<void> {
    await this.container.waitForExist()
    if (driver.isAndroid) {
      await $(SELECTORS.android.option(value)).click()
    } else {
      await $(SELECTORS.ios.wheel).addValue(value)
      await $(SELECTORS.ios.done).click()
    }
    await this.container.waitForExist({ reverse: true })
  }
}

export default new Picker()
