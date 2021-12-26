/** @param {NS} ns **/

import { printTitle, printTable } from 'lib.js';
import { getServers } from 'getServers.js';

export async function main(ns) {
    const servers = getServers(ns);

    printTitle(ns, 'Available Contracts');

    const table = [];
    servers.forEach(({name}) => {
        const contracts = ns.ls(name, '.cct');
        if(contracts.length > 0) {
            table.push({
                'Server': name,
                '#': contracts.length,
            })
        }
    });
    printTable(ns, table);
}