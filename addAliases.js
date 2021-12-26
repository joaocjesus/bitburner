/** @param {NS} ns **/

import { printTitle } from 'lib.js';
import { enterInTerminal } from 'document.js';

export async function main(ns) {
    const servers = ns.getPurchasedServers();
    printTitle(ns, 'Owned servers aliases')

    let aliasesStr = '';
    for(let i = 0; i< servers.length; i++) {
        aliasesStr += `alias ${i}="home; connect ${servers[i]}; "; `
    }
    ns.tprint('Entering aliases... ');
    enterInTerminal(aliasesStr);
    ns.tprint('INFO: Added aliases for servers: ', servers);
    ns.tprint('');
}