/** @param {NS} ns **/

import { printTitle, formatRAM, getThreshold } from 'lib.js';
import { getHackFilename, getGrowFilename, getRootFilename } from 'constants.js';
import { root } from 'root.js';

const files = ['lib.js', 'hit.js', getRootFilename(), getHackFilename(), getGrowFilename(), 'constants.js', 'getServers.js', 'document.js'];

/**
 * It triggers hack/grow/weaken on targets
 * It first runs a script to grow/weaken (grow.js)
 * Once optimal, hit.js is re triggered but it now activates a grow/weaken/hack algo
 */
export async function main(ns) {
    const targets = ns.args[0].split(',');
    const source = ns.args[1];
    const home = ns.args[2]; // Whether it will perform first stage grow/weaken in home server
    const secondStage = ns.args[3]; // to control if it is the second stage to start triggering hacks
    const runScript = secondStage ? getHackFilename() : getGrowFilename();
    const useSource = home === undefined || home === 'false' || home === false ? source : 'home';

    const serverError = (message) => {
        ns.tprint(`ERROR: ${message}`);
        ns.tprint('');
        ns.tprint('Usage:');
        ns.tprint('> run hit.js <targets> <source> [<home>]');
        ns.tprint('');
        ns.tprint(`Separate multiple targets by a comma (,):`);
        ns.tprint('> run hit.js target1,target2,target3 ...');
        ns.tprint('');
        ns.tprint('Targets should not include spaces.')
        ns.tprint('')
        ns.tprint('<home>:')
        ns.tprint('- Use <home> when running grow/weaken from home');
        ns.tprint('- When server money and security is optimal it will then re trigger the script from <source>');
    }

    printTitle(ns, `Hit Targets${secondStage ? ' Refresh' : ''}`);
    ns.tprint('Source: ', useSource);
    ns.tprint('Target(s): ', targets.join(', '))

    if (!targets) {
        serverError('Missing <targets>!');
        return;
    }

    targets.forEach(target => {
        const targetExists = ns.serverExists(target);
        if (!targetExists) {
            serverError(`'${target}' not found!`);
            return;
        }
    });

    if (!source) {
        serverError('Missing <source>!');
        return;
    }

    let sourceExists = ns.serverExists(source);
    if (!sourceExists) {
        serverError(`'${source}' not found!`);
        return;
    }

    if (useSource !== 'home') {
        ns.tprint('Copying files...');
        for (let i = 0; i < files.length; i++) {
            await ns.scp(files[i], 'home', source);
        }
        ns.tprint(`INFO: Files copied to ${source}!`);
    }

    const hackLvl = ns.getHackingLevel();

    targets.forEach(target => {
        const serverHackLvl = ns.getServerRequiredHackingLevel(target);
        if (serverHackLvl > hackLvl) {
            ns.tprint(`ERROR: Insufficient hacking level for ${target}!`)
            ns.tprint('- Requirement: ', serverHackLvl);
            ns.tprint('- Current: ', hackLvl);
            ns.exit();
        }
    });

    ns.tprint('Checking required RAM...');
    const availableRam = ns.getServerMaxRam(useSource) - ns.getServerUsedRam(useSource);
    const scriptRam = ns.getScriptRam(runScript);
    const allTargetsScriptRam = scriptRam * targets.length;
    const threads = Math.floor(availableRam / scriptRam);
    const allTargetsThreads = Math.floor(availableRam / allTargetsScriptRam);

    ns.tprint('Available RAM: ', formatRAM(availableRam));
    ns.tprint('Script RAM: ', formatRAM(scriptRam));
    ns.tprint('Possible threads: ', threads);
    if (targets.length > 1) {
        ns.tprint('Script RAM (all targets): ', formatRAM(allTargetsScriptRam));
        ns.tprint('Possible threads (all targets): ', allTargetsThreads);
    }

    if (threads < 1 || allTargetsThreads < 1) {
        ns.tprint(`ERROR: Not enough RAM on ${useSource}!`);
        ns.exit();
    }

    for (let i = 0; i < targets.length; i++) {
        if (!secondStage) {
            ns.tprint(`INFO: Rooting '${targets[i]}'...`)
            await root(ns, targets[i], false);
        }

        const target = targets[i];
        const serverMaxMoney = ns.getServerMaxMoney(target);
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

        ns.tprint(`INFO: Hacking '${target}' with ${runThreads}/${hackThreads} threads (${formatRAM(scriptRam * runThreads)})...`);
        // ns.tprint(`> run ${HACK_SCRIPT} -t ${runThreads} ${target} ${runThreads} ${hackThreads}`);

        secondStage
            ? ns.exec(runScript, source, runThreads, target, runThreads, hackThreads, false)
            : ns.exec(runScript, useSource, runThreads, target, runThreads, hackThreads, false, source);

        await ns.sleep(500);
    };
}