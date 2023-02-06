class Window {
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

        this.elem = createElement({
            id: args.id,
            className: 'window',
            parent: document.querySelector("#app")
        });

        this.pos = {
            x: (window.innerWidth / 2 - this.width / 2),
            y: (window.innerHeight / 2 - this.height / 2)
        }

        this.name = args.name;

        this.createTitleBar();
        this.createTaskButton();
        this.generateContent();
        this.update();

        this.elem.addEventListener('click', () => {
            if (this.zIndex != app.highestZ) {
                this.zIndex = app.nextZ();
                this.update();
            }
            app.activeWindow = this;
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
        btn.innerHTML = name;
        btn.id = id;
        btn.addEventListener('click', () => {
            fn.call(this)
        });
        return btn;
    }

    createTaskButton() {
        let switcher = document.querySelector('#switcher-buttons');
        this.taskBtn = createElement({
            type: 'button',
            className: 'task-button active',
            innerHTML: this.name,
            parent: switcher
        })
        this.taskBtn.onmousedown = (e) => {
            if (e.button === 2) this.close();
            if (e.button === 0) this.toggleMinimized();
        }
    }

    bringToFront(update = true) {
        if (this.zIndex != app.highestZ) this.zIndex = app.nextZ();
        if (update) this.update();
    }

    createTitleBar() {
        this.titleBar = createElement({
            className: 'window-titlebar',
            parent: this.elem
        })

        const set = () => {
            if (!this.maximized) app.draggedElement = this;
        }

        const rm = () => {
            if (app.draggedElement === this) app.draggedElement = null;
        }

        this.titleBarButtons = createElement({
            className: 'window-titlebar-buttons',
            children: [
                this.createTitleButton('<i class="fas fa-times"></i>', 'close', () => this.close()),
                this.createTitleButton('<i class="fas fa-expand-alt"></i>', 'minimize', () => this.toggleMinimized()),
                this.createTitleButton('<i class="fas fa-compress-alt"></i>', 'maximize', () => this.toggleMaximized()),
            ],
            parent: this.titleBar
        })

        this.titleBarName = createElement({
            misc: {
                onmousedown: set,
                onmouseup: rm
            },
            className: 'window-titlebar-name',
            innerHTML: this.name,
            parent: this.titleBar
        })
    }

    generateContent() { }

    toggleMinimized() {
        this.minimized = !this.minimized;
        this.elem.style.animation = `${this.minimized ? 'minimize' : 'restore'} 0.4s forwards`;
        this.taskBtn.classList[this.minimized ? 'remove' : 'add']('active');
    }

    toggleMaximized() {
        this.maximized = !this.maximized;
        this.taskBtn.classList[this.maximized ? 'add' : 'remove']('maximized');
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