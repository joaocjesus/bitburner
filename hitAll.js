// /** @param {NS} ns **/

import { printTitle, getThreshold } from 'lib.js';
import { getServers } from 'getServers.js';
import { root } from 'root.js';
import { getHackFilename, getRootFilename } from 'constants.js';

const rootScript = getRootFilename();
const hackScript = getHackFilename();

const files = ['lib.js', rootScript, hackScript];

export async function main(ns) {
    let restart;
    if( ns.args[0] === 'restart') {
        restart = true;
    }
    printTitle(ns, 'Hit All Servers');

    const servers = getServers(ns);
    for (let i = 0; i < servers.length; i++) {
        const target = servers[i].name;
        let isRunning = ns.scriptRunning(hackScript, target);
        if(isRunning && restart) {
            ns.scriptKill(getHackFilename(), target);
            isRunning = ns.scriptRunning(hackScript, target);
        }
        if (!isRunning) {
            const serverHackLvl = ns.getServerRequiredHackingLevel(target);
            const hackLvl = ns.getHackingLevel();
            if (serverHackLvl <= hackLvl) {
                for (let f = 0; f < files.length; f++) {
                    await ns.scp(files[f], 'home', target);
                }

                const availableRam = ns.getServerMaxRam(target) - ns.getServerUsedRam(target);
                const scriptRam = ns.getScriptRam(hackScript);
                const threads = Math.floor(availableRam / scriptRam);
                const serverMaxMoney = ns.getServerMaxMoney(target);

                if (threads > 0 && serverMaxMoney > 0) {
                    const serverRoot = await root(ns, target, false);
                    if (serverRoot?.rooted) {
                        const currentMoney = ns.getServerMoneyAvailable(target);
                        const percentFromHack = ns.hackAnalyze(target);
                        const moneyThres = getThreshold(serverMaxMoney);
                        // Get threads required to max money
                        const growThreadsToMax = Math.floor(ns.growthAnalyze(target, serverMaxMoney / (currentMoney > 0 ? currentMoney : 1)));
                        // Get threads required for hacking 50% of max money
                        const hackThreadsRequired = Math.max(Math.floor((serverMaxMoney / 2) / (moneyThres * percentFromHack)), 1);
                        // Get whatever thread requirement is larger within available threads
                        const runThreads = Math.min(Math.max(hackThreadsRequired, growThreadsToMax), threads);
                        // Hack threads can't be higher than available threads
                        const hackThreads = Math.min(hackThreadsRequired, threads);
                        if (serverRoot.rooted) {
                            ns.tprint(`INFO: ${target} being hacked: ${runThreads}/${hackThreads} threads (run/hack)...`);
                            ns.exec(hackScript, target, runThreads, target, runThreads, hackThreads, false);
                        }
                    } else {
                        ns.tprint(`ERROR: ${target} not rooted: ${serverRoot.portCount}/${serverRoot.requiredPorts} ports!`);
                    }
                } else {
                    if (threads === 0) {
                        ns.tprint(`${target} not hacked: Not enough RAM (${availableRam}GB)!`);
                    } else {
                        ns.tprint(`${target} not hacked: No money!`);
                    }
                }
            } else {
                ns.tprint(`WARN: ${target} not hacked: ${hackLvl}/${serverHackLvl} hack level!`);
            }
        } else {
            ns.tprint(`${target}: script already running!`);
        }
    }
}