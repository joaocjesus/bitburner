/** @param {NS} ns **/

/**
 * Prints a formatted title.
 * @param {ns} ns - NS object.
 * @param {string} title - The title to display.
 */
export const printTitle = (ns, title = '') => {
    const margin = 2 * 2;
    const chars = title.length % 2 === 0 ? title.length + margin : title.length + margin + 1;
    const edge = '+' + '-'.repeat(chars) + '+';

    const getLine = (text) => {
        const spacing = Math.round((chars - text.length) / 2);
        return ' '.repeat(spacing) + text + ' '.repeat(spacing);
    }

    ns.tprint(edge);
    ns.tprint(getLine(title));
    ns.tprint(edge);
    // ns.tprintf('');
};

export const ports = [
    { port: 'SSH', file: 'BruteSSH.exe', cmd: 'brutessh' },
    { port: 'SMTP', file: 'FTPCrack.exe', cmd: 'ftpcrack' },
    { port: 'FTP', file: 'relaySMTP.exe', cmd: 'relaysmtp' },
    { port: 'HTTP', file: 'HTTPWorm.exe', cmd: 'httpworm' },
    { port: 'SQL', file: 'SQLInject.exe', cmd: 'sqlinject' },
];

export const nonPortFiles = [
    { name: 'ServerProfiler', file: 'ServerProfiler.exe' },
    { name: 'DeepscanV1', file: 'DeepscanV1.exe' },
    { name: 'DeepscanV2', file: 'DeepscanV2.exe' },
    { name: 'AutoLink', file: 'AutoLink.exe' },
    { name: 'Formulas', file: 'Formulas.exe' },
];

// Converts money into a more readable format (eg: $34.342m)
// Specially usefull in large numbers
export const formatMoney = (value) => {
    const symbols = ['', 'k', 'm', 'b', 't'];
    let newValue = value;
    let count = 0;
    while (newValue > 1000) {
        newValue = newValue / 1000;
        count += 1;
    }
    let formatted = newValue.toString();
    const dotIndex = formatted.indexOf('.');
    if (dotIndex >= 0) {
        formatted = formatted.slice(0, dotIndex + 4);
    }
    return `\$${formatted}${symbols[count]}`;
};

// Makes easier to use big numbers by using 'k', 'm', 'b', 't' in place of the 0s.
// Does not support dot '.' (eg: $23.423m) or decimals
export const unformatMoney = (money) => {
    if (money === '0') return 0;
    let raw = '';
    for (let i = 0; i < money.length; i++) {
        if (money[i].match(/[0-9]/)) {
            raw += money[i];
        } else switch (money[i]) {
            case 'k': {
                raw += '000';
                break;
            }
            case 'm': {
                raw += '000000';
                break;
            }
            case 'b': {
                raw += '000000000';
                break;
            }
            case 't': {
                raw += '000000000000';
                break;
            }
        };
    }
    return Number(raw);
}

// Converts RAM into a more readable format (eg: 512TB)
// Specially usefull in large numbers
export const formatRAM = (value) => {
    const symbols = ['GB', 'TB', 'PB'];
    let newValue = value;
    let count = 0;
    while (newValue > 1024) {
        newValue = newValue / 1024;
        count += 1;
    }
    let formatted = newValue.toString();
    const dotIndex = formatted.indexOf('.');
    if (dotIndex >= 0) {
        formatted = formatted.slice(0, dotIndex + 4);
    }
    return `${formatted}${symbols[count]}`;
};

// Makes easier to use big RAM numbers by also using 'TB' and 'PB'
export const unformatRAM = (ram) => {
    if (ram.toLowerCase().includes('pb')) {
        return Number(ram.replace(/PB/gi, '')) * 1024 * 1024;
    } else if (ram.toLowerCase().includes('tb')) {
        return Number(ram.replace(/TB/gi, '')) * 1024;
    }
    return Number(ram.replace(/GB/gi, ''));
};

export const getThreshold = (value) => {
    return value - (value * 0.1);
};

export const PURCHASED_SERVER_PREFIX = 'wk';

export const HACK_SCRIPT = 'hack.js';

export const getDate = () => {
    const currentDate = new Date();
    const date = currentDate.toDateString().split(' ').slice(1).join(' ');
    const time = currentDate.toTimeString().split(' ')[0];
    return `${time} ${date}`;
};

export const cprintDate = (ns) => {
    ns.print('');
    ns.print(`(${getDate()})`);
    ns.print('');
}

export const printDate = (ns) => {
    ns.tprint('');
    ns.tprint(`(${getDate()})`);
    ns.tprint('');
}