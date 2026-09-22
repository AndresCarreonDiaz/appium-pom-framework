import BasePage from './BasePage.ts'

/**
 * A hybrid screen: the content is a web page inside a native WebView, so it
 * has no native screen id. It counts as shown once a WEBVIEW context exists.
 */
class WebviewPage extends BasePage {
  protected readonly screenId = 'Webview'

  async waitForDisplayed(): Promise<void> {
    await driver.waitUntil(async () => (await this.webviewContext()) !== undefined, {
      timeoutMsg: 'No WEBVIEW context appeared',
    })
  }

  async isDisplayed(): Promise<boolean> {
    return (await this.webviewContext()) !== undefined
  }

  private async webviewContext(): Promise<string | undefined> {
    const contexts = await driver.getContexts()
    return contexts.map(String).find((context) => context.includes('WEBVIEW'))
  }
}

export default new WebviewPage()
