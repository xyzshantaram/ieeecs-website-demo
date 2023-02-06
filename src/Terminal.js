import { PWindow } from "./PWindow.js";
import cf from 'https://esm.sh/campfire.js'

export class Terminal extends PWindow {
    generateContent() {
        cf.insert(
            cf.nu('.window-frame.terminal-frame',
                {
                    c: 'Pseudows cannot find ‘cmd’. Make sure you typed the name correctly, and then try again.'
                }),
            { atEndOf: this.elem }
        );
    }
}