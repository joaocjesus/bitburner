// the purpose of node-manager is to handle hacknet nodes for us
// the primary reason for doing it at all is simply for netburner augs.

import { unformatMoney, printTitle } from 'lib.js';

export async function main(ns) {
    const hn = ns.hacknet;
    const options = ['level', 'ram', 'core', 'node'];
    const keepMoneyReserve = ns.args.length > 0 ? unformatMoney(ns.args[0]) : unformatMoney('$1b');
    printTitle(ns, 'Hacket upgrade');
    ns.tprint('Upgrading hacknet nodes...');

    while(true) {
        let currentNodes = hn.numNodes();
        let maxNodes = 20;
        let needsNode = false;
        if (currentNodes === 0) {
            needsNode = true;
            currentNodes = 1;
        }
        for (let i = 0; i < currentNodes; i++) {
            for (let o = (needsNode ? 3 : 0); o < options.length ; o++) {
                const playerMoney = ns.getServerMoneyAvailable('home');
                let costOfThing = 0;
                switch(o) {
                    case 0:
                        costOfThing = hn.getLevelUpgradeCost(i, 1);
                        break;
                    case 1:
                        costOfThing = hn.getRamUpgradeCost(i, 1);
                        break;
                    case 2:
                        costOfThing = hn.getCoreUpgradeCost(i, 1);
                        break;
                    case 3:
                        costOfThing = hn.getPurchaseNodeCost();
                        break;
                }
                
                const shouldPurchase = playerMoney - keepMoneyReserve > costOfThing;
                if (shouldPurchase) {
                    switch(o) {
                        case 0:
                            hn.upgradeLevel(i, 1);
                            break;
                        case 1:
                            hn.upgradeRam(i, 1);
                            break;
                        case 2:
                            hn.upgradeCore(i, 1);
                            break;
                        case 3:
                            if (currentNodes < maxNodes) hn.purchaseNode();
                            break;
                    }  
                }
            }
        }
        await ns.sleep(10);
    }
}