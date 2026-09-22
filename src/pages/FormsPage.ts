import BasePage from './BasePage.ts'

class FormsPage extends BasePage {
  protected readonly screenId = 'Forms-screen'

  private get input() { return this.byId('text-input') }
  private get inputResult() { return this.byId('input-text-result') }
  private get switchToggle() { return this.byId('switch') }
  private get switchLabel() { return this.byId('switch-text') }
  private get activeButton() { return this.byId('button-Active') }
  private get inactiveButton() { return this.byId('button-Inactive') }

  // iOS only opens the picker from the chevron icon; Android from the field itself.
  private get dropdown() {
    return driver.isAndroid ? this.byId('Dropdown') : this.byId('dropdown-chevron')
  }

  private get dropdownValue() {
    return this.byPlatform({
      android: '//*[@content-desc="Dropdown"]//android.widget.EditText',
      ios: '-ios class chain:**/*[`name == "Dropdown"`]/**/*[`name == "text_input"`]',
    })
  }

  async typeText(text: string): Promise<void> {
    await this.input.setValue(text)
    await this.hideKeyboard()
  }

  async typedTextResult(): Promise<string> {
    return this.inputResult.getText()
  }

  async toggleSwitch(): Promise<void> {
    await this.switchToggle.click()
  }

  async switchLabelText(): Promise<string> {
    return this.switchLabel.getText()
  }

  async openDropdown(): Promise<void> {
    await this.dropdown.click()
  }

  async selectedDropdownValue(): Promise<string> {
    return this.dropdownValue.getText()
  }

  async tapActiveButton(): Promise<void> {
    await this.scrollTo(this.activeButton)
    await this.activeButton.click()
  }

  async tapInactiveButton(): Promise<void> {
    await this.scrollTo(this.inactiveButton)
    await this.inactiveButton.click()
  }

  private async scrollTo(element: ReturnType<typeof this.byId>): Promise<void> {
    await element.scrollIntoView({ scrollableElement: await this.screen, maxScrolls: 3 })
  }
}

export default new FormsPage()
