/** @param {NS} ns **/

import { enterInTerminal } from 'document.js';
import { getServerPath } from 'getServers.js';

export async function main(ns) {
    const serverToFind = ns.args[0];

    if (!serverToFind) {
        ns.tprint('ERROR: Please enter a server name!');
        ns.tprint('Usage:');
        ns.tprint('> run openServer.js <server name>');
        ns.tprint('');
        ns.exit();
    }

    const serverPath = getServerPath(ns, { serverToFind });
    enterInTerminal(serverPath);
}