import { PWindow } from "./PWindow.js";
import cf from 'https://esm.sh/campfire.js';
import { evalArithmetic } from "./util.js";

export class Calculator extends PWindow {
    static BUTTONS = [1, 2, 3, '+', 4, 5, 6, '-', 7, 8, 9, '*', 'C', 0, '^', '/'];
    constructor(width, height, args) {
        super(width, height, args);
        this.disableNthTitleButton(2);
    }

    toggleMaximized() { }

    generateContent() {
        let frame = cf.insert(cf.nu('.window-frame.calculator-frame'), { atEndOf: this.elem })
        this.field = cf.nu('input.calc-field', { misc: { type: 'text' } })
        const container = cf.insert(cf.nu('.calc-items'), { atEndOf: frame });
        cf.insert(this.field, { atEndOf: container });

        const that = this;
        Calculator.BUTTONS.forEach((button) => {
            let btn = cf.insert(cf.nu('button', { c: button.toString(), misc: { type: 'button', value: button } }), { atEndOf: container })
            if (button === 'C') btn.onclick = () => that.field.value = '';
            else btn.onclick = () => that.field.value += btn.value;
        })

        cf.insert(cf.nu('button.calc-equals', { c: '=', misc: { value: '=', onclick: () => this.compute(this.field) } }), { atEndOf: container })
    }

    compute(field) {
        field.value = field.value.trim();
        try {
            if (field.value) field.value = evalArithmetic(field.value);
        } catch (e) {
            field.value = e;
        }
    }
}