/** @param {NS} ns **/

import { printTitle, formatMoney } from 'lib.js';
import { getServers } from 'getServers.js';
import { printTableModal } from 'document.js';

const hacking = (ns, server) => {
    const ownedServers = ns.getPurchasedServers();
    ownedServers.push('home');
    for (let i = 0; i < ownedServers.length; i++) {
        const processes = ns.ps(ownedServers[i]);
        for (let p = 0; p < processes.length; p++) {
            if (processes[p].args.includes(server)) return true;
        };
    };
    return false;
};

const hackingItself = (ns, server) =>
    ns.getServerUsedRam(server) !== 0 ? true : false;

export async function main(ns) {
    const sort = ['name', 'money', 'maxmoney', 'hack'];
    let arg = ns.args[0];
    let filter = ns.args[1];
    if (arg === 'filter') {
        arg = null;
        filter = true;
    }
    const host = ns.args[2] || 'home';
    let servers = getServers(ns);
    let target;
    let sortBy;

    if (arg) {
        if (sort.includes(arg.toLowerCase())) {
            sortBy = arg.toLowerCase();
        } else {
            if (ns.serverExists(arg)) {
                target = arg;
            } else {
                printTitle(ns, 'Money');
                ns.tprint(`ERROR: '${arg}' does not match any server or valid sortBy value!`);
                ns.tprint('Usage:');
                ns.tprint('> run money.js [<server>] [<sortBy>] [<host>]');
                ns.tprint('');
                ns.tprint(`- SortBy options: ${sort.join(' ')}`);
                ns.tprint(`- Host: where to perform action from`);
                ns.tprint('');
                ns.exit();
            }
        }

        if (target) {
            printTitle(ns, `Money - ${target}`);
            const server = servers.find(server => server.name === target);
            printTable(ns, [server], 'name');
            ns.exit();
        }

        let prop;

        if (sortBy) {
            switch (sortBy) {
                case 'maxmoney':
                    prop = 'maxMoney';
                    break;
                case 'hack':
                    prop = 'hackLvl';
                    break;
                default:
                    prop = sortBy;
            }

            let sorted = [];
            servers.forEach(server => {
                let isHigher = false;
                for (let i = 0; i < sorted.length; i++) {
                    const condition = isNaN(server[prop]) ? server[prop].toLowerCase() <= sorted[i][prop].toLowerCase() : server[prop] >= sorted[i][prop];
                    if (condition) {
                        isHigher = true;
                        sorted.splice(i, 0, server);
                        break;
                    }
                };
                if (!isHigher) sorted.push(server);
            });
            servers = sorted;
        }
    }

    printTitle(ns, 'Money on servers');

    ns.tprintf(`Sorted by: ${sortBy || 'None'}`);
    if (filter) ns.tprintf('Filtered by hacking level');
    ns.tprintf('');

    const serversToRender = [];
    servers.forEach(server => {
        const show = !filter || ns.getHackingLevel() >= server.hackLvl;
        if (show) serversToRender.push(server);
    });

    const formattedServers = serversToRender.map(({ name, money, maxMoney, hackLvl }) => {
        let status = hacking(ns, name) ? 'Active ' : '';

        if (hackingItself(ns, name)) status += '(+)';
        return {
            'Server': name,
            'Money': formatMoney(money),
            'Max Money': formatMoney(maxMoney),
            'Hack': hackLvl,
            'Status': status,
        }
    });
    printTableModal(ns, { array: formattedServers, action: 'Hit', host, header: 'Server List by Money' });
}