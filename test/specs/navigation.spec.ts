import TabBar, { type Tab } from '../../src/components/TabBar.ts'
import HomePage from '../../src/pages/HomePage.ts'
import WebviewPage from '../../src/pages/WebviewPage.ts'
import LoginPage from '../../src/pages/LoginPage.ts'
import FormsPage from '../../src/pages/FormsPage.ts'
import SwipePage from '../../src/pages/SwipePage.ts'
import DragPage from '../../src/pages/DragPage.ts'
import type BasePage from '../../src/pages/BasePage.ts'

const SCREENS: [Tab, BasePage][] = [
  ['Webview', WebviewPage],
  ['Login', LoginPage],
  ['Forms', FormsPage],
  ['Swipe', SwipePage],
  ['Drag', DragPage],
  ['Home', HomePage],
]

describe('Tab bar navigation', () => {
  before(async () => {
    await TabBar.waitForDisplayed()
  })

  for (const [tab, page] of SCREENS) {
    it(`opens the ${tab} screen`, async () => {
      await TabBar.open(tab)
      await page.waitForDisplayed()
      expect(await page.isDisplayed()).toBe(true)
    })
  }
})
