import cf from 'https://esm.sh/campfire.js';
import { app } from './App.js';

export const getCSSCustomProp = (propKey, element = document.documentElement, castAs = 'string') => {
    let response = getComputedStyle(element).getPropertyValue(propKey);
    // Tidy up the string if there's something to work with
    if (response.length) {
        response = response.replace(/\'|"/g, '').trim();
    } else {
        return null;
    }
    // Convert the response into a whatever type we wanted
    switch (castAs) {
        case 'number':
        case 'int':
            return parseInt(response, 10);
        case 'float':
            return parseFloat(response, 10);
        case 'boolean':
        case 'bool':
            return response === 'true' || response === '1';
    }
    // Return the string response by default
    return response;
};

export function saveFile(blob, name) {
    let link = createElement({
        type: 'a',
        misc: {
            href: URL.createObjectURL(blob),
            download: name || 'file.txt'
        }
    })
    link.click();
}

export function evalArithmetic(string) {
    if (/[^+\-*\/\^().0-9 ]/.test(string)) throw new Error("Non-arithmetic character detected");
    while (/\^/.test(string)) {
        string = string.replace('^', '**');
    }
    return eval(string);
}

export function matchesList(el, selectorList) {
    for (let x of selectorList) if (el.matches(x)) return true;
    return false;
}

export const launchApp = (item) => {
    app.addWindow(item.obj, item.width, item.height, { name: item.title });
}

export function populateItems(apps) {
    let menuList = document.querySelector("#menu-items");
    menuList.innerHTML = '';
    for (let key in apps) {
        const item = apps[key];
        const icon = item.icon || '';

        cf.insert(cf.nu('button.menu-item', {
            c: icon,
            on: {
                click: () => launchApp(item)
            },
            m: { title: item.title }, raw: true
        }), { atEndOf: menuList })
    }
}