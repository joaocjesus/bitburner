/** @param {NS} ns **/

import { getThreshold, cprintDate } from 'lib.js'; 

export async function main(ns) {
    const target = isNaN(ns.args[0]) ? ns.args[0] : null;
    const threads = ns.args[1] || 1;
    const hackThreads = ns.args[2] || 1;
    const output = ns.args[3] === undefined ? true : ns.args[3];
    const source = ns.args[4];

    if (!target && output) {
        ns.tprint('Error:');
        ns.tprint('- Missing target server!');
        ns.tprint('');
        ns.tprint('Usage:');
        ns.tprint('> run grow.js [-t <threads>] <server> [<threads>] [<max hack threads>]');
        ns.exit();
    }

    if (output) {
        ns.tprint(`Grow/Weaken: ${threads} threads`);
        ns.tprint(`Hacking: ${hackThreads} threads`);
        ns.tprint(`Processing '${target}'...`);
    }
    const minSecurity = ns.getServerMinSecurityLevel(target);
    const securityThresh = minSecurity + 5;
    const serverMaxMoney = ns.getServerMaxMoney(target);
    const moneyThres = getThreshold(serverMaxMoney);

    // Loop that continously grows/weakens the target server until it reaches optmical ratios
    while (true) {
        const money = ns.getServerMoneyAvailable(target);
        const security = ns.getServerSecurityLevel(target);
        cprintDate(ns);
        let toast = `${target}: (M) ${(money/serverMaxMoney*100).toFixed(0)}% | (S) ${security.toFixed(2)}/${minSecurity}`;
        // If the server's security level is above our threshold, weaken it
        // If the server's money is less than our threshold, grow it
        // Otherwise, hack it 
        if (security > securityThresh) {
            toast += ' | Weakening...';
            ns.toast(toast, 'info', 8000);
            await ns.weaken(target, { threads });
        } else if (money < moneyThres) {
            toast += ' | Growing...';
            ns.toast(toast, 'info', 8000);
            await ns.grow(target, { threads });
        } else {
            toast += ` | (T) ${threads}/${hackThreads} | Rerunning...`;
            ns.toast(toast, 'warning', 15000);
            ns.tprint(toast);
            ns.spawn('hit.js', 1, target, source, false, true );
        }
        await ns.sleep(500);
    }
}