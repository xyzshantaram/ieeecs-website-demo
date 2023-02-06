import { PWindow } from "./PWindow.js";
import cf from 'https://esm.sh/campfire.js';

export class Notepad extends PWindow {
    generateContent() {
        const elt = cf.insert(cf.nu('.window-frame.notepad-frame'), { atEndOf: this.elem });
        const actions = cf.insert(cf.nu('.window-actions'), { atEndOf: elt });
        const ta = cf.insert(cf.nu('textarea.notepad'), { atEndOf: elt });

        // save button
        cf.insert(cf.nu('span.window-action-button', {
            c: 'Save',
            on: { click: () => this.save(ta.value) }
        }), { atEndOf: actions });

        // close button
        cf.insert(cf.nu('span.window-action-button', {
            c: 'Close',
            on: { click: () => this.close() }
        }), { atEndOf: actions });
    }

    save(contents) {
        let blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
        createPrompt('Save as', 'Enter a filename.', // Title, message
            (name) => saveFile(blob, name), // Success callback
            'Save', // Button alias
            (type) => createAlert('Cancelled', // Error callback
                type == ALERT_CANCELLED ? "Input cancelled." : "Empty filename.",
                'info'
            )
        );
    }

    close() {
        createConfirm('Confirm', 'Are you sure you want to exit?',
            () => super.close(), () => hideAlert(), // yes and no callbacks
            "I'm sure", "Cancel" // Button aliases
        );
    }
}