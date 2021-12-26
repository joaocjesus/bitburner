/** @param {NS} ns **/

import { printTitle } from 'lib.js';
import { getPurchasedServerPrefix } from 'constants.js';

export const getServerPath = (ns, { serverToFind, output = false, stopOnFind = false } = {}) => {
    const servers = getServers(ns, { output, stopOnFind });

    const foundServer = servers.find(server => server.name === serverToFind );
    let connectPath = '';
    foundServer.path.forEach(node => {
        if(node === 'home') connectPath += 'home; '
        else connectPath += `connect ${node}; `;
    })
    return connectPath;
}

export const getServers = (ns, { startingServer = 'home', serverToTag, output = false, stopOnFind = false } = {}) => {
    const servers = [];
    const ignore = ['darkweb', 'home'];
    const scanServers = (start, parent = '', level = 0, path = ['home']) => {
        if (level === 0 && output) {
            ns.tprint(start);
        }
        const currentScan = ns.scan(start);

        for (let i = 0; i < currentScan.length && currentScan.length > 1; i++) {
            const server = currentScan[i];
            if (!server.includes(getPurchasedServerPrefix() + '-') && !ignore.includes(server) && server !== parent) {
                if (output) {
                    serverToTag && serverToTag === server
                        ? ns.tprint('◼︎◼︎'.repeat(level) + '▶︎ ' + server + ' ◀◼︎◼︎◼︎◼︎◼︎◼︎◼︎◼︎◼︎◼︎')
                        : ns.tprint('  '.repeat(level) + '➤ ' + server);
                }
                servers.push({ 
                    name: server,
                    parent: start,
                    path: [...path, server],
                    money: ns.getServerMoneyAvailable(server),
                    maxMoney: ns.getServerMaxMoney(server),
                    hackLvl: ns.getServerRequiredHackingLevel(server),
                });
                if (stopOnFind && server === serverToTag) {
                    return servers;
                }
                scanServers(server, start, level + 1, [...path, server]);
            }
        };
        return servers;
    };

    return scanServers(startingServer);
};

export async function main(ns) {
    const tag = ns.args[0];
    printTitle(ns, 'Get servers');
    getServers(ns, { serverToTag: tag, output: true });
}