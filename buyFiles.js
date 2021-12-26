/** @param {NS} ns **/

import { ports, nonPortFiles } from "lib.js";
import { enterInTerminal } from "document.js";

export async function main(ns) {
  ports.forEach(({ port, file }) => {
    const exists = ns.fileExists(file, "home");
    ns.print(`${port} port: `);
    if (exists) {
      ns.tprint(`'${file}' file already purchased!`);
    } else {
      ns.tprint(`Buying ${file}...`);
      enterInTerminal(`buy ${file}`);
    }
  });

  nonPortFiles.forEach(({ name, file }) => {
    const exists = ns.fileExists(file, "home");
    ns.print(`${name}: `);
    if (exists) {
      ns.tprint(`'${file}'' file already purchased!`);
    } else {
      ns.tprint(`Buying '${file}' ...`);
      enterInTerminal(`buy ${file}`);
    }
  });
}
