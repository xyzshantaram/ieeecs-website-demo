import { PWindow } from "./PWindow.js";
import cf from 'https://esm.sh/campfire.js';
import cfa from 'https://esm.sh/cf-alert';
import { saveFile } from "./util.js";

export class Notepad extends PWindow {
    generateContent() {
        const elt = cf.insert(cf.nu('.window-frame.notepad-frame'), { atEndOf: this.elem });
        const actions = cf.insert(cf.nu('.window-actions'), { atEndOf: elt });
        const ta = cf.insert(cf.nu('textarea.notepad'), { atEndOf: elt });

        // save button
        cf.insert(cf.nu('span.window-action-button', {
            c: 'Save',
            on: { click: async () => await this.save(ta.value) }
        }), { atEndOf: actions });

        // close button
        cf.insert(cf.nu('span.window-action-button', {
            c: 'Close',
            on: { click: async () => await this.close() }
        }), { atEndOf: actions });
    }

    async save(contents) {
        let blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
        try {
            const name = await cfa.input('text', 'Enter a filename', 'Save as');
            if (name) {
                let blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
                saveFile(blob, name);
            }
            else {
                throw 'Empty filename.';
            }
        }
        catch (e) {
            await cfa.message(`Error saving: ${e}`);
        }
    }

    async close() {
        const choice = await cfa.confirm('Are you sure you want to exit?');
        if (choice) {
            super.close()
        }
    }
}