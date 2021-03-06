import { sleep, inEvolution } from './utility.js';
import { autoEvolution } from './evolution.js';
import { autoEmploy } from './jobs.js';
import { autoBattle } from './war.js';
import { autoTax, autoGovernment, autoUnification } from './government.js';
import { autoSmelter, autoFactory, autoDroid, autoGraphene } from './industry.js';
import { autoPriority } from './priority.js';
import { autoCraft, autoTrade, autoMarket, autoStorage, autoEjector } from './resources.js';
import { settings, loadSettings, updateSettings, autoRefresh, autoPrestige } from './settings.js';
import { autoFarm, loadFarm } from './farm.js';
import { autoSupport } from './support.js';
import { updateUI } from './ui.js';


export const url = 'https://github.com/HLXII/Evolve-Autoscript';
export const version = '1.3.7';
export const workingVersion = '0.7.5';

(async function() {
    console.log("Waiting for game to load...");
    await sleep(2000);
    await main();
})();

async function main() {

    window.evolve = unsafeWindow.evolve;
    console.log(window.evolve);
    'use strict';

    if (!window.evolve) {
        let alertStr = 'You currently have Evolve AutoScript installed, however the Enable Script Support toggle is not active. Please enable that in the Settings tab and refresh the page for the script to work correctly.';
        alert(alertStr);
        return;
    }

    await loadSettings();
    console.log(settings);

    // Main script loop
    var count = 1;
    while(1) {
        await sleep(2000);
        await fastAutomate(count);
        count += 1;
    }
}

async function fastAutomate(count) {
    console.clear();
    console.log(count);
    updateUI();
    updateSettings();
    autoFarm();
    autoRefresh();
    autoBattle();
    if (inEvolution()) {
        // Evolution Automation
        if(settings.autoEvolution) {
            await autoEvolution();
            // Loading buttons again to get DNA button
            loadFarm();
        }
    } else {
        // Civilization Automation
        var priorityData = null;
        if (settings.autoPriority) {
            priorityData = await autoPriority(count);
        }
        else {
            if (settings.autoSmelter) {
                await autoSmelter();
            }
            if (settings.autoFactory) {
                await autoFactory();
            }
            if (settings.autoDroid) {
                await autoDroid();
            }
            if (settings.autoGraphene) {
                await autoGraphene();
            }
            if (settings.autoSupport) {
                await autoSupport();
            }
        }
        if (settings.autoTrade){autoTrade(priorityData);}
        if (settings.autoEjector) {autoEjector();}
        if (settings.autoCraft){
            autoCraft();
        }
        if (settings.autoEmploy){
            autoEmploy(priorityData);
        }
        if (settings.autoTax) {
            autoTax();
        }
        if (settings.autoMarket){
            await autoMarket();
        }
        if (settings.autoStorage) {
            autoStorage();
        }
        if (settings.autoGovernment) {
            await autoGovernment();
        }
        if (settings.autoUnification) {
            await autoUnification();
        }
        if (settings.autoPrestige) {
            await autoPrestige();
        }
    }
}