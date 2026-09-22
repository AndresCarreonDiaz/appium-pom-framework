import TabBar from '../../src/components/TabBar.ts'
import SwipePage, { CARDS } from '../../src/pages/SwipePage.ts'

describe('Swipe gestures', () => {
  beforeEach(async () => {
    // Carousel position carries over between tests, so each one starts from a fresh app.
    await driver.relaunchActiveApp()
    await TabBar.waitForDisplayed()
    await TabBar.open('Swipe')
    await SwipePage.waitForDisplayed()
  })

  it('moves through the carousel cards and back', async () => {
    expect(await SwipePage.isCardActive(0)).toBe(true)

    for (let index = 1; index < CARDS.length; index++) {
      await SwipePage.nextCard()
      expect(await SwipePage.isCardActive(index)).toBe(true)
    }

    await SwipePage.previousCard()
    expect(await SwipePage.isCardActive(CARDS.length - 2)).toBe(true)
  })

  it('finds the hidden message by scrolling down the screen', async () => {
    await SwipePage.scrollToHiddenMessage()

    expect(await SwipePage.isHiddenMessageDisplayed()).toBe(true)
  })
})
