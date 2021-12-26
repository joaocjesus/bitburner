/** @param {NS} ns **/

import { formatMoney, formatRAM, printTitle, unformatRAM } from 'lib.js';
import { getPurchasedServerPrefix } from 'constants.js';

const serverPrefix = getPurchasedServerPrefix();

export async function main(ns) {
	let ramAmount = ns.args[1] || '4GB'; // eg: 32GB or 1024TB
	const maxServers = ns.getPurchasedServerLimit(); // Not working with more that 20??
	const maxSize = ns.getPurchasedServerMaxRam();
	const currentMoney = ns.getServerMoneyAvailable('home');
	const currentServerCount = ns.getPlayer().serverCount || 0;
	let amount = ns.args[0] || 1;
	let ram = unformatRAM(ramAmount);

	printTitle(ns, 'Purchase server(s)');

	// Calculate max affordable RAM
	let affordableRam = 1;
	while (affordableRam * 2 <= maxSize && ns.getPurchasedServerCost(affordableRam * 2) <= currentMoney) {
		affordableRam *= 2;
	}

	let errors = [];
	if (ns.args.length === 0) {
		errors.push('WARN: Please specify amount of servers to purchase or RAM size!');
	}

	if (ns.args.length === 1) {
		if (ns.args[0].includes('GB') || ns.args[0].includes('TB')) {
			ramAmount = ns.args[0];
			ram = unformatRAM(ramAmount);
			amount = 1;
		} else {
			errors.push('WARN: Please specify amount of RAM to purchase!');
		}
	}

	if (amount && amount > maxServers - currentServerCount) {
		errors.push(`ERROR: You cannot own more than ${maxServers} servers!`);
	}

	if (ns.getPurchasedServerCost(ram) * amount > currentMoney) {
		errors.push(`ERROR: You can't currently afford ${amount > 1 ? amount : 'a'} ${ramAmount} server(s)!`);
	}

	// Show helper text if invalid args or none
	if (errors.length > 0) {
		errors.forEach(error => ns.tprint(error));
		ns.tprint('');
		ns.tprint(`Server name prefix: ${serverPrefix}`);
		ns.tprint(`Max RAM size: ${formatRAM(maxSize)}`);
		ns.tprint(`Current money: ${formatMoney(currentMoney)}`);
		ns.tprint(``);
		ns.tprint('Server prices:');

		let ramCounter = 2;
		let serverCosts = [];
		let maxChars = 0; // To be used when displaying data
		while (ramCounter <= maxSize) {
			const cost = formatMoney(ns.getPurchasedServerCost(ramCounter));
			const mem = formatRAM(ramCounter);
			serverCosts.push({ ram: mem, cost });
			ramCounter *= 2;
			maxChars = Math.max(maxChars, cost.length + mem.length);
		}

		const columns = 2;
		const rows = Math.round(serverCosts.length / columns);
		// Prints server costs (2 per row)
		for (let i = 0; i < rows; i++) {
			const ramChars = serverCosts[i].ram.length;
			const costChars = serverCosts[i].cost.length;
			const maxRamChars = 6;
			const spacingToRam = ramChars === maxRamChars ? '' : ' '.repeat(maxRamChars - ramChars);
			const spacingToColumn = ' '.repeat(6 + maxChars - ramChars - costChars);
			const secondColumn = i + rows < serverCosts.length ? `${serverCosts[i + rows].ram}: ${serverCosts[i + rows].cost}` : '';
			ns.tprint(`${spacingToRam}${serverCosts[i].ram}: ${serverCosts[i].cost}${spacingToColumn}${secondColumn}`);
		}

		ns.tprint(``);
		ns.tprint('Top affordable options:');
		let listedRam = affordableRam;
		while (listedRam >= 2 && Math.floor(currentMoney / ns.getPurchasedServerCost(listedRam)) <= (maxServers - currentServerCount)) {
			const price = ns.getPurchasedServerCost(listedRam);
			const affordableCount = Math.floor(currentMoney / price);
			ns.tprint(`${affordableCount} x ${formatRAM(listedRam)} => ${formatMoney(price * affordableCount)}`);
			listedRam = listedRam / 2;
		}
		// Prints current owned servers based on prefix
		if (ns.serverExists(`${serverPrefix}-0`)) {
			ns.tprint(``);
			ns.tprint('Current servers:');
			const ownedServers = ns.getPurchasedServers();
			ownedServers.forEach(server => {
				ns.tprint(`- '${server}': ${formatRAM(ns.getServerMaxRam(server))}`);
			});
		}
		ns.tprint(``);
		ns.tprint(`INFO - To purchase server:`);
		ns.tprint(`> run purchaseServer.ns [<# servers>] <RAM size>`);
		ns.tprint(``);
		ns.tprint(`Max # servers per run is ${maxServers}.`);
		ns.exit();
	}

	let serverCount = amount;
	for (let i = 0; i < serverCount && i < maxServers; i++) {
		const serverName = `${serverPrefix}-${i}`;
		if (ns.serverExists(serverName)) {
			serverCount++;
			continue;
		}
		ns.purchaseServer(serverName, ram);
		ns.tprint(`INFO: Purchased '${serverName}' with ${ramAmount} of RAM for ${formatMoney(ns.getPurchasedServerCost(ram))}!`);
		ns.tprint('');
	}
}