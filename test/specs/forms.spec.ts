import TabBar from '../../src/components/TabBar.ts'
import NativeAlert from '../../src/components/NativeAlert.ts'
import Picker from '../../src/components/Picker.ts'
import FormsPage from '../../src/pages/FormsPage.ts'

describe('Form components', () => {
  beforeEach(async () => {
    await TabBar.waitForDisplayed()
    await TabBar.open('Forms')
    await FormsPage.waitForDisplayed()
  })

  it('echoes the text typed into the input field', async () => {
    const text = 'Automated with Appium'

    await FormsPage.typeText(text)

    expect(await FormsPage.typedTextResult()).toContain(text)
  })

  it('turns the switch on and off', async () => {
    expect(await FormsPage.switchLabelText()).toBe('Click to turn the switch ON')

    await FormsPage.toggleSwitch()
    expect(await FormsPage.switchLabelText()).toBe('Click to turn the switch OFF')

    await FormsPage.toggleSwitch()
    expect(await FormsPage.switchLabelText()).toBe('Click to turn the switch ON')
  })

  it('selects a value from the dropdown', async () => {
    for (const value of ['webdriver.io is awesome', 'Appium is awesome']) {
      await FormsPage.openDropdown()
      await Picker.select(value)

      expect(await FormsPage.selectedDropdownValue()).toContain(value)
    }
  })

  it('shows an alert from the active button and closes it with each option', async () => {
    for (const option of ['Ask me later', 'Cancel', 'OK']) {
      await FormsPage.tapActiveButton()
      await NativeAlert.waitForDisplayed()
      expect(await NativeAlert.text()).toContain('This button is active')

      await NativeAlert.tap(option)
    }
  })

  it('does nothing when the inactive button is tapped', async () => {
    await FormsPage.tapInactiveButton()

    expect(await NativeAlert.appearsWithin(2_000)).toBe(false)
  })
})
