import { PWindow } from "./PWindow.js";
import { generateMineArray, Board, CellStateEnum, BoardStateEnum, CellFlagEnum } from '../minesweeper.js';
import cf from 'https://esm.sh/campfire.js';
import cfa from "https://esm.sh/cf-alert";

export class Minesweeper extends PWindow {
    generateContent() {
        const frame = cf.insert(cf.nu('.window-frame.mines-frame'), { atEndOf: this.elem });
        console.log(frame);
        const actions = cf.insert(cf.nu('.window-actions'), { atEndOf: frame });

        // about button
        cf.insert(cf.nu('span.window-action-button', {
            c: 'About...',
            on: { click: () => this.showAboutNotice() }
        }), { atEndOf: actions });

        // help button
        cf.insert(cf.nu('span.window-action-button', {
            c: 'Help',
            on: { click: () => this.showHelp() }
        }), { atEndOf: actions });

        this.gridContainer = cf.insert(cf.nu('.mine-grid'), { atEndOf: frame });

        this.board = new Board(generateMineArray({
            rows: 15,
            cols: 15,
            mines: 40
        }));

        this.moveCount = 0;
        this.render()
    }

    showAboutNotice() {
        cfa.message(
            `<h3>Mines v1.1</h3>
            <div>Copyright © 2021 Siddharth Singh</div>
            <hr>
            <strong>Acknowledgements</strong>
            <div><a href='https://github.com/binaryluke/Minesweeper'>Minesweeper</a> Copyright (c) 2015 Luke Howard </div>`,
            'About', 'OK', false);
    }

    showHelp() {
        cfa.message(
            `<h3>How to play:</h3>
            <ul>
            <li> Use your mouse's left button to open tiles. </li>
            <li> Opened tiles display the number of mines in the closed areas around them. </li>
            <li> Use your mouse's right button to set flags on tiles. that you suspect contain mines. You can set an exclamation flag or a question flag. </li>
            <li> You win the game if you open all the tiles without triggering any mines. </li>
            </ul>
            `, 'Help', 'OK', false
        )
    }

    async checkWon() {
        const state = this.board._state;
        switch (state) {
            case BoardStateEnum.LOST:
                await cfa.message(
                    this.moveCount == 1
                        ? 'You lost, but looks like it was because your first click was a mine... Sorry about that!'
                        : 'You lost the game.', 'You lost', 'Finish'
                );
                this.close();
                break;
            case BoardStateEnum.WON:
                await cfa.message(`You won in ${this.moveCount} moves.`, 'Congratulations!', 'Finish')
                break;
            default:
                break;
        }
    }

    render() {
        this.checkWon();
        this.gridContainer.innerHTML = '';
        const grid = this.board.grid();

        for (let y = 0; y < this.board.numRows(); y++) {
            const row = cf.insert(cf.nu('.mine-row'), { atEndOf: this.gridContainer })
            for (let x = 0; x < this.board.numCols(); x++) {
                const btn = cf.insert(cf.nu('button.mine-tile', { misc: { type: 'button' } }), { atEndOf: row })
                let cell = grid[y][x];

                if (cell.state === CellStateEnum.CLOSED) {
                    switch (cell.flag) {
                        case CellFlagEnum.NONE:
                            btn.innerHTML = ' '
                            break;
                        case CellFlagEnum.EXCLAMATION:
                            btn.innerHTML = '<i class="fa fa-exclamation-circle"></i>'
                            break;
                        case CellFlagEnum.QUESTION:
                            btn.innerHTML = '<i class="fa fa-question-circle"></i>'
                            break;
                        case undefined:
                        default:
                            break;
                    }
                }
                else {
                    if (cell.isMine) btn.innerHTML = '<i class="fa fa-bomb"></i>'
                    else {
                        Object.assign(btn.style, {
                            boxShadow: 'none',
                            border: '1px solid slategray',
                            background: '#aaaaaa'
                        })
                        if (cell.numAdjacentMines) btn.innerHTML = cell.numAdjacentMines;
                    }
                }

                btn.onmousedown = (e) => {
                    if (grid[y][x].state == CellStateEnum.OPEN) return;
                    if (e.button == 0) this.board.openCell(x, y);
                    else this.board.cycleCellFlag(x, y);
                    this.moveCount += 1;
                    this.render();
                }
            }
        }
    }
}