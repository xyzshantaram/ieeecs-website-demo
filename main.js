function init() {
    app = new App();
    window.addEventListener('mousemove', (e) => {
        if (app.draggedElement != null) {
            if (!app.lastMousePos.x || !app.lastMousePos.y) return;

            let d = { x: e.clientX - app.lastMousePos.x, y: e.clientY - app.lastMousePos.y };
            app.draggedElement.pos.x += d.x;
            app.draggedElement.pos.y += d.y;

            app.draggedElement.update();
        }
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