import { Notepad } from "./Notepad.js"
import { Terminal } from "./Terminal.js"
import { Calculator } from "./Calculator.js"
import { Minesweeper } from "./Minesweeper.js"
import { About } from "./About.js"

export const apps = {
    'Notepad': {
        title: 'Notepad',
        obj: Notepad, width: 400, height: 300,
        desktop: true, icon: '<i class="fas fa-file-alt"></i>'
    },
    'Terminal': {
        title: 'Terminal',
        obj: Terminal, width: 500, height: 300,
        desktop: true, icon: '<i class="fas fa-terminal"></i>'
    },
    'Calculator': {
        title: 'Calculator',
        obj: Calculator, width: 300, height: 400,
        desktop: true, icon: '<i class="fas fa-calculator"></i>'
    },
    'Minesweeper': {
        title: 'Mines',
        obj: Minesweeper, width: 500, height: 500,
        desktop: true, icon: '<i class="fas fa-bomb"></i>'
    },
    'About...': {
        title: 'About',
        obj: About, width: 300, height: 200,
        desktop: false, icon: '<i class="fas fa-info-circle"></i>'
    },
}