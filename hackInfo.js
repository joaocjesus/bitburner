/** @param {NS} ns **/

import { printTitle, formatMoney, getThreshold } from 'lib.js';

export async function main(ns) {
    const target = isNaN(ns.args[0]) ? ns.args[0] : null;
    printTitle(ns, 'Hack Info' + (target ? ' (' + target + ')' : ''));

    if (!target) {
        ns.tprint('Error:');
        ns.tprint('- Missing target server!');
        ns.tprint('');
        ns.tprint('Usage:');
        ns.tprint('> run hackInfo.js <server>');
        return;
    }

    const serverMaxMoney = ns.getServerMaxMoney(target);
    const currentMoney = ns.getServerMoneyAvailable(target);
    const moneyThres = getThreshold(serverMaxMoney);
    const percentFromHack = ns.hackAnalyze(target);
    const moneyFromHack = (threadCount) => moneyThres * percentFromHack * threadCount;
    const requiredThreads = Math.floor(currentMoney / moneyFromHack(1));
    const hackLvlRequired = ns.getServerRequiredHackingLevel(target);
    const hackLvl = ns.getHackingLevel();
    const security = ns.getServerSecurityLevel(target);

    ns.tprint('Max Money: ', formatMoney(serverMaxMoney));
    ns.tprint('Money threshold: ', formatMoney(moneyThres));
    ns.tprint('Money Available: ', formatMoney(currentMoney));

    ns.tprint(`Current hack level: ${hackLvl}`);
    ns.tprint(`Hack level required: ${hackLvlRequired}`);
    ns.tprint(`Hack with 1 thread: `, formatMoney(moneyFromHack(1)));
    ns.tprint(`Threads required for threshold: `, requiredThreads);
    ns.tprint(`Hack with ${requiredThreads} threads: `, formatMoney(moneyFromHack(requiredThreads)));

    ns.tprint('Security Level: ', security.toFixed(3));
}