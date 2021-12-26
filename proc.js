/** @param {NS} ns **/

import { printTitle, formatRAM } from 'lib.js';
import { printTableModal } from 'document.js';

export async function main(ns) {
    const serversArg = ns.args[0];
    const title = 'Processes on Purchased Servers';
    const servers = serversArg ? [...serversArg.split(',')] : ns.getPurchasedServers();
    let ran;
    for (let i = 0; i < servers.length; i++) {
        const server = servers[i];
        const ram = ns.getServerMaxRam(server);
        const free = ram - ns.getServerUsedRam(server);
        const header = `Server: ${server} - ${formatRAM(ram)} RAM (free: ${formatRAM(free)})`;
        const processes = ns.ps(server);
        const output = processes.map(({ pid, filename, args }) => {
            return {
                pid,
                filename,
                target: args[0] || '',
                runThreads: args[1] || '',
                hackThreads: args[2] || '',
            };
        });

        ran = printTableModal(ns, { array: output, title: `${title}\n${header}` });
    };

    if (!ran) {
        printTitle(ns, title);
        ns.tprint('No personal servers or no processes running on them!');
        ns.tprint('Servers found: ', servers);
    }
}