import { sleep, inEvolution } from './utility.js';
import { autoEvolution } from './evolution.js';
import { autoEmploy } from './jobs.js';
import { autoSmelter, autoFactory, autoDroid, autoGraphene } from './modalbuildings.js';
import { autoPriority } from './priority.js';
import { autoCraft, autoTrade, autoMarket, autoStorage, autoEjector } from './resources.js';
import { settings, loadSettings, updateSettings, autoRefresh, autoTax, autoPrestige } from './settings.js';
import { autoFarm, loadFarm } from './farm.js';
import { autoSupport } from './support.js';
import { updateUI } from './ui.js';
import { autoBattle } from './war.js';

export const url = 'https://github.com/HLXII/Evolve-Autoscript';
export const version = '1.3';

(async function() {
    console.log("Waiting for game to load...");
    await sleep(2000);
    await main();
})();

async function main() {

    window.evolve = unsafeWindow.evolve;
    console.log(window.evolve);
    'use strict';

    loadSettings();
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
            autoEvolution();
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
            if (settings.autoSmelter && count % settings.smelterSettings.Interval == 0) {
                await autoSmelter();
            }
            if (settings.autoFactory && count % settings.factorySettings.Interval == 0) {
                await autoFactory();
            }
            if (settings.autoDroid && count % settings.droidSettings.Interval == 0) {
                await autoDroid();
            }
            if (settings.autoGraphene && count % settings.grapheneSettings.Interval == 0) {
                await autoGraphene();
            }
            if (settings.autoSupport && count % settings.supportSettings.Interval == 0) {
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
            autoMarket();
        }
        if (settings.autoStorage) {
            autoStorage();
        }
        if (settings.autoPrestige) {
            await autoPrestige();
        }
    }
}