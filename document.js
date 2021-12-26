/** @param {NS} ns **/

import { modalStyles } from 'styles.js';

// Enter a command in the terminal input
// Terminal needs to be currently displayed
export const enterInTerminal = (command) => {
    // Acquire a reference to the terminal text field
    const terminalInput = document.getElementById("terminal-input");

    // Set the value to the command you want to run.
    terminalInput.value = command;

    // Get a reference to the React event handler.
    const handler = Object.keys(terminalInput)[1];

    // Perform an onChange event to set some internal values.
    terminalInput[handler].onChange({ target: terminalInput });

    // Simulate an enter press
    terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
}

/**
 * Prints an HTML table from an Array.
 * 
 * @param {NS} ns - NS object.
 * @param {Array} array - The array with the data to display.
 * @param {string} serverCol - Column with server name to create link for connection via terminal
 */
export const printTableModal = (ns, { array, serverCol = 'server', title, header, action, host, append }) => {
    if (array.length === 0) return false;
    const table = document.createElement('table');
    const columnsNames = Object.keys(array[0]);

    if (action) {
        columnsNames.push('Action');
    }

    const trHead = document.createElement('tr');
    const borderStyle = '1px solid #203020';
    let server;
    table.setAttribute('id', 'jj-table');
    table.style.borderCollapse = 'collapse';
    trHead.setAttribute('class', 'table-header');

    columnsNames.forEach((column, index) => {
        const value = column?.toString() || '';
        const th = document.createElement('th');
        if (column.toLowerCase() === serverCol.toLowerCase()) server = index;
        th.append(value);
        trHead.append(th);
    });
    table.append(trHead);

    let serverInRow;
    array.forEach(row => {
        const tr = document.createElement('tr');
        tr.setAttribute('class', 'row');
        tr.style.border = borderStyle;
        Object.values(row).forEach((value, index) => {
            const td = document.createElement('td');
            td.setAttribute('class', 'cell');
            td.style.border = borderStyle;
            if (!isNaN(value)) td.style.textAlign = 'center'
            if (index === server) {
                const a = document.createElement('a');
                a.style.cursor = 'pointer';
                a.onclick = function () {
                    enterInTerminal(`run openServer.js ${value}`);
                    const modal = document.getElementById('jj-modal');
                    modal.style.display = 'none';
                };
                a.append(value);
                td.append(a);
                serverInRow = value;
            } else {
                td.append(value);
            }
            tr.append(td);
        });
        if (action && serverInRow) {
            const button = document.createElement('button');
            button.append(action);
            const buttonText = `hit ${serverInRow} ${host || 'home'}`;
            button.onclick = function () { enterInTerminal(buttonText) };
            const td = document.createElement('td');
            td.className = 'action';
            td.style.border = borderStyle;
            td.append(button);
            tr.append(td);
        }
        table.append(tr);
    });

    let modal = document.querySelector('#jj-modal');
    let headerTitle;
    let modalContent;

    if (modal && !append) {
        modal.remove();
    }
    if (!modal || !append) {
        const root = document.getElementById('root');
        const head = document.querySelector('head');
        let style = document.getElementById('jj-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'jj-style';
            style.append(modalStyles);
        }
        head.append(style);
        modal = document.createElement('div');
        modal.className = 'jj-modal';
        modal.id = 'jj-modal';

        modalContent = document.createElement('div');
        modalContent.className = 'jj-modal-content';
        modalContent.id = 'jj-modal-content';

        const closeButton = document.createElement('div');
        closeButton.className = 'close';
        closeButton.append('X');
        closeButton.onclick = function () {
            modal.style.display = "none";
        }

        const headerDiv = document.createElement('div');
        headerDiv.className = 'jj-header';
        headerDiv.id = 'jj-header';
        headerTitle = document.createElement('div');
        headerTitle.className = 'jj-header-title';
        headerTitle.id = 'jj-header-title';
        headerDiv.append(headerTitle);
        headerDiv.append(closeButton);

        const container = document.createElement('div');
        container.className = 'jj-container';
        container.append(headerDiv);
        container.append(modalContent);

        modal.append(container);
        root.append(modal);

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    } else {
        modalContent = document.getElementById('jj-modal-content');
        headerTitle = document.getElementById('jj-header-title');
        modal.style.display = 'block';
    }

    headerTitle.append(header);
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'jj-title';
    titleDiv.append(`Current Host: ${host}`);
    if (title) {
        titleDiv.append(title);
    }
    const tableDiv = document.createElement('div');
    tableDiv.className = 'jj-table';
    tableDiv.append(table);
    modalContent.append(titleDiv);
    modalContent.append(tableDiv);

    modalContent.scrollTop = modalContent.scrollHeight - modalContent.clientHeight - 900;
    return true;
};

// Temp until merged with previous one
export const printTable = async (ns, { array, serverCol = 'server', title }) => {
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

    terminal.append(title);
    await ns.sleep(100)
    terminal.append(table);
};