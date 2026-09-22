import TabBar from '../../src/components/TabBar.ts'
import DragPage from '../../src/pages/DragPage.ts'

describe('Drag and drop puzzle', () => {
  beforeEach(async () => {
    // The puzzle keeps its state for the whole session, so each test starts
    // from a freshly launched app with a full board.
    await driver.relaunchActiveApp()
    await TabBar.waitForDisplayed()
    await TabBar.open('Drag')
    await DragPage.waitForDisplayed()
  })

  it('removes a piece from the board once it is dropped in its slot', async () => {
    await DragPage.dragPieceToSlot('c2')

    expect(await DragPage.isPieceOnBoard('c2')).toBe(false)
    expect(await DragPage.isPieceOnBoard('c1')).toBe(true)
  })

  it('solves the puzzle and starts a new game', async () => {
    await DragPage.solvePuzzle()
    await DragPage.waitForSuccess()

    await DragPage.playAgain()
    expect(await DragPage.isPieceOnBoard('l1')).toBe(true)
  })
})
