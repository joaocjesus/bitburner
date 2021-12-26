/** @param {NS} ns **/
import { printTitle } from 'lib.js';

export const root = async (ns, target, output = true) => {
    const log = (message) => {
        if (output) {
            ns.tprint(message);
        }
    }

    if (!target && output) {
        log('');
        log('ERROR: Missing target server!');
        log('');
        log('Usage:');
        log('> run root.js <target>');
        return;
    }

    if (output) printTitle(ns, `Rooting ${target}`);

    if(!ns.serverExists(target)) {
        ns.tprint('Server not found: ', target);
        ns.exit();
    }

    let portCount = 0;

    if (ns.fileExists('BruteSSH.exe', 'home')) {
        log(`Opening SSH port...`);
        portCount++;
        ns.brutessh(target);
    }

    if (ns.fileExists('FTPCrack.exe', 'home')) {
        log(`Opening FTP port...`);
        portCount++;
        ns.ftpcrack(target);
    }

    if (ns.fileExists('relaySMTP.exe', 'home')) {
        log(`Opening SMTP port...`);
        portCount++;
        ns.relaysmtp(target);
    }

    if (ns.fileExists('HTTPWorm.exe', 'home')) {
        log(`Opening HTTP port...`);
        portCount++;
        ns.httpworm(target);
    }

    if (ns.fileExists('SQLInject.exe', 'home')) {
        log(`Opening SQL port...`);
        portCount++;
        ns.sqlinject(target);
    }

    const requiredPorts = ns.getServerNumPortsRequired(target);

    if (requiredPorts > portCount) {
        log('');
        log('ERROR: Not enough ports open to root target!')
        log('- Ports required: ', requiredPorts);
        log('- Current: ', portCount);
        return { rooted: false, requiredPorts, portCount };
    }

    if (!ns.hasRootAccess(target)) {
        log('Getting root access...');
        ns.nuke(target);
    }

    log('Root finished!');
    return { rooted: true, requiredPorts, portCount };
}

export async function main(ns) {
    await root(ns, ns.args[0]);
}