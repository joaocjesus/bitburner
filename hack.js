/** @param {NS} ns **/

import { getThreshold, cprintDate } from 'lib.js';

export async function main(ns) {
    const target = isNaN(ns.args[0]) ? ns.args[0] : null;
    const threads = ns.args[1] || 1;
    const hackThreads = ns.args[2] || 1;
    const output = ns.args[3] === undefined ? true : ns.args[3];

    if (!target && output) {
        ns.tprint('Error:');
        ns.tprint('- Missing target server!');
        ns.tprint('');
        ns.tprint('Usage:');
        ns.tprint('> run hack.js [-t <threads>] <server> [<threads>] [<max hack threads>]');
        ns.exit();
    }

    if (output) {
        ns.tprint(`Grow/Weaken: ${threads} threads`);
        ns.tprint(`Hacking: ${hackThreads} threads`);
        ns.tprint(`Processing '${target}'...`);
    }

    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    const serverMaxMoney = ns.getServerMaxMoney(target);
    const moneyThres = getThreshold(serverMaxMoney);

    // Infinite loop that continously hacks/grows/weakens the target server
    while (true) {
        const money = ns.getServerMoneyAvailable(target);
        const security = ns.getServerSecurityLevel(target);
        cprintDate(ns);
        // If the server's security level is above our threshold, weaken it
        // If the server's money is less than our threshold, grow it
        // Otherwise, hack it
        if (security > securityThresh) {
            await ns.weaken(target, { threads });
        } else if (money < moneyThres) {
            await ns.grow(target, { threads });
        } else {
            await ns.hack(target, { threads: hackThreads });
        }
        await ns.sleep(500);
    }
}