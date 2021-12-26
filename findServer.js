/** @param {NS} ns **/

import { printTitle } from 'lib.js';
import { getServerPath } from 'getServers.js';

export async function main(ns) {
    const serverToFind = ns.args[0];

    printTitle(ns, 'Find server');

    if (!serverToFind) {
        ns.tprint('ERROR: Please enter a server name!');
        ns.tprint('Usage:');
        ns.tprint('> run findServer.js <server name>');
        ns.tprint('');
        ns.exit();
    }

    ns.tprint(`Scanning servers for ${serverToFind}...`);
    const serverPath = getServerPath(ns, { serverToFind, output: false, stopOnFind: true });
    ns.tprint('');
    navigator.clipboard.writeText(serverPath);
    ns.tprint(`To connect to '${serverToFind}' (copied to clipboard):`);
    ns.tprint(serverPath);
}