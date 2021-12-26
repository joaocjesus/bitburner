/** @param {NS} ns **/

import {  printTable } from 'newLib2.js';
import { getServers } from 'getServers.js';

export async function main(ns) {
    const servers = getServers(ns);

    const table = [];
    servers.forEach(({ name }) => {
        const contracts = ns.ls(name, '.cct');
        if (contracts.length > 0) {
            table.push({
                'Server': name,
                '#': contracts.length,
            })
        }
    });
     printTable(ns, table);



}