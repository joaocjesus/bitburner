/** @param {NS} ns **/
import { enterInTerminal } from 'document.js';
import { getServerPath } from 'findServer.js';

function contains(selector, text) {
    var elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function (element) {
        return RegExp(text).test(element.textContent);
    });
}

/**
 * Prints a table from a Array.
 * @param ns - NS object.
 * @param array - The array with the data to display.
 */
export const printTable = async (ns, array) => {
    const columnsNames = Object.keys(array[0]);
    const columnsMaxChars = columnsNames.map(name => name.toString().length);
    array.forEach(row => {
        columnsNames.forEach((column, index) => {
            const value = row[column]?.toString() || '';
            if (value.length > columnsMaxChars[index]) columnsMaxChars[index] = value.length;
        })
    });

    const headers = [];
    const margin = 4;

    columnsNames.forEach((name, index) => {
        const repeats = Math.max(columnsMaxChars[index], name.toString().length);
        const spacer = ' '.repeat(repeats - name.toString().length + margin);
        const underline = '-'.repeat(repeats);
        const underlineSpacer = ' '.repeat(margin);
        headers.push({ name, spacer, underline, underlineSpacer });
    });

    let titles = '';
    headers.forEach(({ name, spacer }) => {
        titles += `${name}${spacer}`;
    });

    let underlines = '';
    headers.forEach(({ underline, underlineSpacer }) => {
        underlines += `${underline}${underlineSpacer}`;
    });

    ns.tprintf(titles);
    ns.tprintf(underlines);
    const timestamp = new Date();

    for (let i = 0; i < array.length; i++) {
        let row = '';
        Object.keys(array[i]).forEach((key, index) => {
            const placeholderStart = '<PH>'
            const placeholderEnd = '</PH>'
            let value;
            let repeats;
            if (key.toLowerCase().includes('server')) {
                value = `${placeholderStart}${array[i][key].toString()}${placeholderEnd}`;
                repeats = columnsMaxChars[index] - array[i][key].toString().length + margin;
            } else {
                value = array[i][key]?.toString() || '';
                repeats = columnsMaxChars[index] - value.length + margin;
            }
            const spacer = ' '.repeat(repeats);
            row += `${value}${spacer}`;
        });
        ns.tprintf(row);
    };
    ns.tprint('');
    ns.tprint(timestamp);

    let rendered;
    let count = 0;
    do {
        await ns.sleep(50)
        rendered = Array.from(document.querySelector('ul#terminal > li > p')).find(el => el.textContent.includes(timestamp));
        count++;
    }
    while (!rendered && count < 10);


    // Acquire a reference to the terminal list of lines.
    // const list = document.getElementById("generic-react-container").querySelector("ul");
    // await ns.sleep(500);
    document.querySelectorAll('ul#terminal > li > p').forEach(el => {
        if (el.textContent.includes('<PH>')) {
            // ns.tprint('el: ', el.innerText);
            const before = el.textContent.match(/(.*)(<PH>)/)[1];
            const after = el.textContent.match(/<\/PH>(.*)/)[1];
            const server = el.textContent.match(/<PH>(.*)<\/PH>/)[1];
            // ns.tprint('before', before);
            // ns.tprint('after', before);
            // ns.tprint('server', before);
            const p = document.createElement('p');
            const a = document.createElement('a');

            a.append(server);
            a.className = el.className;
            a.style.textDecoration = 'none';
            const serverPath = getServerPath(ns, { serverToFind: server });
            a.href = '#'
            a.onclick = function () { enterInTerminal(serverPath) };
            p.className = el.className;
            p.append(before);
            p.append(a);
            p.append(after);
            // ns.tprint('p: ', p)
            el.replaceWith(p);
        }
    })

};