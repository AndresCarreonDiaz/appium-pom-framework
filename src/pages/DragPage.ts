import BasePage from './BasePage.ts'

const PIECES = ['l1', 'c1', 'r1', 'l2', 'c2', 'r2', 'l3', 'c3', 'r3'] as const
export type Piece = (typeof PIECES)[number]

class DragPage extends BasePage {
  protected readonly screenId = 'Drag-drop-screen'

  private piece(id: Piece) { return this.byId(`drag-${id}`) }
  private slot(id: Piece) { return this.byId(`drop-${id}`) }
  private get renewButton() { return this.byId('renew') }
  private get retryButton() { return this.byId('button-Retry') }

  /** Drops a piece in its slot and waits until the app takes it off the board. */
  async dragPieceToSlot(id: Piece): Promise<void> {
    const piece = this.piece(id)
    await piece.dragAndDrop(await this.slot(id))
    await piece.waitForExist({ reverse: true, timeoutMsg: `Piece ${id} was not accepted by its slot` })
  }

  async solvePuzzle(): Promise<void> {
    for (const id of PIECES) {
      await this.dragPieceToSlot(id)
    }
  }

  async isPieceOnBoard(id: Piece): Promise<boolean> {
    return this.piece(id).isExisting()
  }

  async waitForSuccess(): Promise<void> {
    await this.retryButton.waitForDisplayed()
  }

  async playAgain(): Promise<void> {
    await this.retryButton.click()
    await this.renewButton.waitForDisplayed()
  }
}

export default new DragPage()
