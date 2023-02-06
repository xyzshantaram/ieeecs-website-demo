import { app } from './src/App.js';
import { populateItems } from './src/util.js';
import { apps } from "./src/apps.js";
import { launchApp } from './src/util.js';
import { matchesList } from './src/util.js';

function init() {
    window.addEventListener('mousemove', (e) => {
        if (!app.draggedElement) return;
        if (!app.lastMousePos.x || !app.lastMousePos.y)
            app.lastMousePos = { x: e.clientX, y: e.clientY };

        let d = { x: e.clientX - app.lastMousePos.x, y: e.clientY - app.lastMousePos.y };
        app.draggedElement.pos.x += d.x;
        app.draggedElement.pos.y += d.y;

        app.draggedElement.update();
        app.lastMousePos = { x: e.clientX, y: e.clientY }
    });

    window.addEventListener('click', (e) => {
        if (!matchesList(e.target,
            ['.desktop-item', '.desktop-icon', '.desktop-item.selected', '.desktop-label', '.desktop-icon > i']
        )) {
            document.querySelectorAll('.desktop-item.selected').forEach((elem) => elem.classList.remove('selected'));
        }
    })

    populateItems(apps);
    launchApp(apps["About..."])
}

window.addEventListener('DOMContentLoaded', () => init());