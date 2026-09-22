import BasePage from './BasePage.ts'

export const CARDS = [
  'FULLY OPEN SOURCE',
  'GREAT COMMUNITY',
  'JS.FOUNDATION',
  'SUPPORT VIDEOS',
  'EXTENDABLE',
  'COMPATIBLE',
] as const

class SwipePage extends BasePage {
  protected readonly screenId = 'Swipe-screen'

  private get carousel() {
    return this.byPlatform({ android: '//*[@resource-id="Carousel"]', ios: '~Carousel' })
  }

  private card(index: number) {
    const id = `__CAROUSEL_ITEM_${index}__`
    return this.byPlatform({ android: `//*[@resource-id="${id}"]`, ios: `~${id}` })
  }

  // Android doesn't expose an accessibility id for the hidden logo, so match its caption.
  private get hiddenMessage() {
    return this.byPlatform({
      android: '//*[@text="You found me!!!"]',
      ios: '~You found me!!!',
    })
  }

  async nextCard(): Promise<void> {
    await this.swipe('left', this.carousel)
  }

  async previousCard(): Promise<void> {
    await this.swipe('right', this.carousel)
  }

  /**
   * The carousel keeps every card in the view tree, so "visible" isn't enough.
   * The active card is the one whose left edge sits inside the carousel's left half.
   */
  async isCardActive(index: number): Promise<boolean> {
    const carousel = await this.carousel.getLocation()
    const size = await this.carousel.getSize()
    const card = await this.card(index)
    if (!(await card.isExisting())) return false
    const { x } = await card.getLocation()
    return x >= carousel.x && x < carousel.x + size.width / 2
  }

  /**
   * Scrolls the page until the hidden message shows. Every swipe starts outside the
   * carousel, because a swipe that starts on it is taken as a carousel swipe and the
   * page doesn't move (this bites on small Android screens).
   */
  async scrollToHiddenMessage(maxSwipes = 10): Promise<void> {
    const page = await this.screen.getLocation()
    const size = await this.screen.getSize()
    const x = Math.round(page.x + size.width / 2)
    const top = page.y
    const bottom = page.y + size.height

    for (let swipe = 0; swipe < maxSwipes; swipe++) {
      if (await this.hiddenMessage.isDisplayed()) return
      const startY = await this.swipeStartOutsideCarousel(top, bottom)
      await driver.swipe({ from: { x, y: startY }, to: { x, y: top + 20 } })
    }
    throw new Error(`Hidden message not visible after ${maxSwipes} swipes`)
  }

  private async swipeStartOutsideCarousel(top: number, bottom: number): Promise<number> {
    const margin = 20
    if (!(await this.carousel.isDisplayed())) return bottom - margin
    const carousel = await this.carousel.getLocation()
    const { height } = await this.carousel.getSize()
    // Prefer the band above the carousel while there is room to swipe from it.
    if (carousel.y - top > 150) return Math.round(carousel.y - margin)
    return Math.round(Math.min(carousel.y + height + margin, bottom - margin))
  }

  async isHiddenMessageDisplayed(): Promise<boolean> {
    return this.hiddenMessage.isDisplayed()
  }
}

export default new SwipePage()
