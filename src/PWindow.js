import { app } from './App.js';
import cf from 'https://esm.sh/campfire.js';
import { getCSSCustomProp } from './util.js';

export class PWindow {
    hasChanged = true;
    width = 300;
    height = 240;
    zIndex = 1;
    minimized = false;
    maximized = false;

    constructor(width, height, args) {
        this.zIndex = app.nextZ();
        this.width = width;
        this.height = height;

        this.lastDraw = {}

        this.elem = cf.insert(
            cf.nu(`.window`),
            {
                atEndOf: cf.select('#app')
            }
        );

        this.pos = {
            x: (window.innerWidth / 2 - this.width / 2),
            y: (window.innerHeight / 2 - this.height / 2)
        }

        this.name = args.name;

        this.createTitleBar();
        this.generateContent();
        this.update();

        this.elem.addEventListener('click', () => {
            if (this.zIndex != app.highestZ) {
                this.zIndex = app.nextZ();
                this.update();
            }
            app.activePWindow = this;
        })

        this.elem.style.animation = 'grow 0.2s forwards';

        if (getCSSCustomProp('--is-screen-too-narrow') === '1') {
            this.toggleMaximized();
            this.disableNthTitleButton(2);
        }
    }

    update() {
        let styles = {
            width: this.maximized ? '100%' : this.width + 'px',
            height: this.maximized ? '96%' : this.height + 'px',
            left: this.maximized ? '0' : this.pos.x + 'px',
            top: this.maximized ? '0' : this.pos.y + 'px',
            zIndex: this.zIndex
        }
        Object.assign(this.elem.style, styles);
    }

    createTitleButton(name, id, fn) {
        let btn = document.createElement('button');
        btn.innerHTML = `<i class='fas ${name}'></i>`;
        btn.id = id;
        btn.addEventListener('click', () => {
            fn.call(this)
        });
        return btn;
    }

    bringToFront(update = true) {
        if (this.zIndex != app.highestZ) this.zIndex = app.nextZ();
        if (update) this.update();
    }

    createTitleBar() {
        this.titleBar = cf.insert(cf.nu('.window-titlebar'), { atEndOf: this.elem });
        const that = this;
        const set = () => {
            console.log('set', app.draggedElement, that);
            if (!this.maximized) app.draggedElement = that;
        }

        const rm = () => {
            console.log('rm', app.draggedElement, that);
            if (app.draggedElement === that) app.draggedElement = null;
        }

        this.titleBarButtons = cf.insert(cf.nu('.window-titlebar-buttons'), { atEndOf: this.titleBar });
        [
            this.createTitleButton('fa-times', 'close', () => this.close()),
            this.createTitleButton('fa-expand-alt', 'minimize', () => this.toggleMaximized()),
            this.createTitleButton('fa-compress-alt', 'maximize', () => this.toggleMinimized()),
        ].forEach(e => this.titleBarButtons.appendChild(e));
        const name = this.name;
        this.titleBarName = cf.insert(cf.nu('.window-titlebar-name', {
            c: name
        }), { atEndOf: this.titleBar });
        this.titleBarName.onmouseup = rm;
        this.titleBarName.onmousedown = set;
    }

    generateContent() { }

    toggleMinimized() {
        this.minimized = !this.minimized;
        this.elem.style.animation = `${this.minimized ? 'minimize' : 'restore'} 0.4s forwards`;
    }

    toggleMaximized() {
        this.maximized = !this.maximized;
        if (this.maximized) {
            this.preMaximize = {
                x: this.pos.x,
                y: this.pos.y,
                width: this.width,
                height: this.height
            }
            this.pos.x = 0;
            this.pos.y = 0;
        } else {
            const { width, height, x, y } = this.preMaximize;
            Object.assign(this, { height, width, pos: { x, y } });
        }
        this.bringToFront(false);
        this.update();
    }

    disableNthTitleButton(n) {
        const btn = this.titleBarButtons.querySelector(`:nth-child(${n})`);
        btn.setAttribute('disabled', 'disabled');
        Object.assign(btn.style, {
            cursor: 'not-allowed'
        });
    }

    close() {
        this.elem.style.animation = 'die 0.2s forwards';
        setTimeout(() => document.querySelector('#app').removeChild(this.elem), 210);
    }
}