/** @param {NS} ns **/
import { formatMoney, formatRAM } from './lib.js';

export async function main(ns) {
    const showTitle = ns.args.length === 0;   
    if(showTitle) {
        ns.tprint('Server costs:');
        ns.tprint('-------------');
    }
    
    let ramCounter = 2;
    // Max server RAM is 2^20
    for(let i = 1; i <= 20; i++) {
        const cost = formatMoney(ns.getPurchasedServerCost(ramCounter));
        ns.tprint(`- ${formatRAM(ramCounter)} server: ${cost}`);
        ramCounter *= 2;
    }
}