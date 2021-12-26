/** @param {NS} ns **/

import { printTitle } from './lib.js';

export async function main(ns) {
    const url = ns.args[0];

    printTitle(ns, 'Get file', 'Gets file from dropbox');

    if (!url) {
        ns.tprint('ERROR: Missing url!');
        ns.tprint('');
        ns.tprint('Usage:');
        ns.tprint('> run get.js <file url>');
        ns.tprint('');
        ns.tprint('Description:');
        ns.tprint('- Gets file from Dropbox.');
        return;
    }

    // Extract filename from url
    const file = url.replace('?dl=0', '').match(/s\/[a-zA-Z0-9]+\/(.*)/)[1];

    // Create download link
    const link = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');

    // Downloads file
    ns.tprint('Downloading file: ', file);
    await ns.wget(link, file);
    ns.tprint('Done!');
}