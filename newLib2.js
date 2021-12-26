/** @param {NS} ns **/
import { enterInTerminal } from 'document.js';
import { getServerPath } from 'findServer.js';

/**
 * Prints an HTML table from an Array.
 * 
 * @param {NS} ns - NS object.
 * @param {Array} array - The array with the data to display.
 * @param {string} serverCol - Column with server name to create link for connection via terminal
 */
export const printTable = (ns, array, serverCol = 'server') => {
    const terminal = document.querySelector('#terminal');
    const classes = terminal.querySelector('li > p').className;
    const table = document.createElement('table');
    const columnsNames = Object.keys(array[0]);
    const trHead = document.createElement('tr');
    const borderStyle = '1px solid grey';
    let server;

    table.setAttribute('id', 'jj-table');
    table.style.maxWidth = '100%';
    table.style.minWidth = '50%';
    table.style.border = '1px solid grey';
    table.style.borderCollapse = 'collapse';
    trHead.setAttribute('class', 'header');

    columnsNames.forEach((column, index) => {
        const value = column?.toString() || '';
        const th = document.createElement('th');
        if (column.toLowerCase() === serverCol.toLowerCase()) server = index;
        th.style.padding = '0 15px';
        th.style.border = borderStyle;
        th.className = classes;
        th.append(value);
        trHead.append(th);
    });

    table.append(trHead);

    array.forEach(row => {
        const tr = document.createElement('tr');
        tr.setAttribute('class', 'row');
        tr.style.border = borderStyle;
        Object.values(row).forEach((value, index) => {
            const td = document.createElement('td');
            td.setAttribute('class', 'cell');
            td.style.border = borderStyle;
            if (!isNaN(value)) td.style.textAlign = 'center'
            td.style.paddingLeft = '5px';
            if (index === server) {
                const path = getServerPath(ns, { serverToFind: value });
                const a = document.createElement('a');
                a.style.cursor = 'pointer';
                a.onclick = function () { enterInTerminal(path) };
                a.append(value);
                td.append(a);
            } else {
                td.append(value);
            }
            td.className = classes;
            tr.append(td);
        });
        table.append(tr);
    });

    terminal.append(table);
};

/**
 * Prints an HTML table from an Array.
 * 
 * @param {NS} ns - NS object.
 * @param {Array} array - The array with the data to display.
 * @param {string} serverCol - Column with server name to create link for connection via terminal
 */
export const printTablev2 = (ns, array, serverCol = 'server') => {
    const terminal = document.querySelector('#terminal');
    const classes = terminal.querySelector('li > p').className;
    const table = document.createElement('table');
    const columnsNames = Object.keys(array[0]);
    const trHead = document.createElement('tr');
    const borderStyle = '1px solid #203020';
    const padding = '4px';
    let serverIndex;

    table.setAttribute('id', 'jj-table');
    table.style.maxWidth = '100%';
    table.style.minWidth = '50%';
    table.style.border = borderStyle;
    table.style.borderCollapse = 'collapse';
    trHead.setAttribute('class', 'header');

    columnsNames.forEach((column, index) => {
        const value = column?.toString() || '';
        const th = document.createElement('th');
ns.tprint('columm: ', column)
        if (column.toLowerCase() === serverCol.toLowerCase()) serverIndex = index;
        th.style.padding = padding;
        th.style.border = borderStyle;
        th.className = classes;
        th.append(value);
        trHead.append(th);
    });

    table.append(trHead);

    array.forEach(row => {
        const tr = document.createElement('tr');
        tr.setAttribute('class', 'row');
        tr.style.border = borderStyle;
        tr.style.padding = padding;
        Object.values(row).forEach((value, index) => {
            const td = document.createElement('td');
            td.setAttribute('class', 'cell');
            td.style.border = borderStyle;
            td.style.padding = '0 10px';
            if (!isNaN(value)) td.style.textAlign = 'center';
ns.tprint('value: ', value)
ns.tprint(`index: ${index} - serverIndex = ${serverIndex}`)
            if (index === serverIndex) {
                const path = getServerPath(ns, { serverToFind: value });
                const a = document.createElement('a');
                a.style.cursor = 'pointer';
                a.onclick = function () { enterInTerminal(path) };
                a.append(value);
                td.append(a);
                ns.tprint('value (index): ', value)
            } else {
ns.tprint('value2: ', value)
                td.append(value);
            }
            td.className = classes;
            tr.append(td);
        });
        table.append(tr);
    });
ns.tprint(table);
    terminal.append(table);
};